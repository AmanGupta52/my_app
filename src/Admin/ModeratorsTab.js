import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./ModeratorsTab.css";

const API_BASE = "http://localhost:5000/api/admin";

/** Helpers */
const parseTimeRange = (timeStr = "") => {
  const [from = "", to = ""] = String(timeStr).split("-").map((s) => s.trim());
  const fix = (v) => (v && /^\d{1,2}:\d{2}$/.test(v) ? v.padStart(5, "0") : "");
  return { from: fix(from), to: fix(to) };
};
const buildTimeRange = (from, to) => (from && to ? `${from}-${to}` : "");

const bufferToDataUrl = (img) => {
  try {
    if (!img || !img.data || !img.contentType) return "";
    const arr = img.data?.data || img.data;
    const binary = Uint8Array.from(arr).reduce((acc, b) => acc + String.fromCharCode(b), "");
    const base64 = btoa(binary);
    return `data:${img.contentType};base64,${base64}`;
  } catch {
    return "";
  }
};

const availabilityOptions = ["Available", "Busy", "Away", "Offline", "On Leave"];
const experienceOptions = ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
const commonSpecialities = ["Mental Health", "Relationships", "Career", "Addiction", "Trauma", "Anxiety", "Depression"];
const commonLanguages = ["English", "Spanish", "French", "Arabic", "Hindi", "Mandarin", "German"];

const emptyNewMod = {
  fullName: "",
  title: "",
  availability: "",
  specialities: [],
  languages: [],
  time: "",
  experience: "",
  email: "",
  password: "",
  img: null,
};

const ModeratorsTab = () => {
  const { token } = useContext(AuthContext);
  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${localStorage.getItem("token") || token}` }),
    [token]
  );

  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, available: 0, busy: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Add form state
  const [newMod, setNewMod] = useState(null);
  const [newTimeFrom, setNewTimeFrom] = useState("");
  const [newTimeTo, setNewTimeTo] = useState("");

  // Edit form state
  const [editMod, setEditMod] = useState(null);
  const [editTimeFrom, setEditTimeFrom] = useState("");
  const [editTimeTo, setEditTimeTo] = useState("");
  const [editImgFile, setEditImgFile] = useState(null);

  useEffect(() => {
    fetchMods();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Calculate statistics whenever moderators change
    if (mods.length > 0) {
      const total = mods.length;
      const available = mods.filter(m => m.availability === "Available").length;
      const busy = mods.filter(m => m.availability === "Busy").length;
      setStats({ total, available, busy });
    }
  }, [mods]);

  const fetchMods = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/moderators`, {
        headers: authHeader,
      });
      setMods(res.data || []);
    } catch (err) {
      console.error("Error fetching moderators:", err.response?.data || err.message);
      alert("Failed to fetch moderators");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this moderator?")) return;
    try {
      await axios.delete(`${API_BASE}/moderators/${id}`, {
        headers: authHeader,
      });
      setMods((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting moderator:", err.response?.data || err.message);
      alert("Failed to delete moderator");
    }
  };

  const handleAdd = async () => {
    if (!newMod) return;
    
    // Validation
    if (!newMod.fullName || !newMod.email || !newMod.password) {
      alert("Please fill in all required fields (Name, Email, Password)");
      return;
    }
    
    try {
      const formData = new FormData();
      const time = buildTimeRange(newTimeFrom, newTimeTo);

      ["fullName", "title", "availability", "experience", "email", "password"].forEach((k) =>
        formData.append(k, newMod[k] || "")
      );
      formData.append("time", time);

      formData.append("specialities", (newMod.specialities || []).join(","));
      formData.append("languages", (newMod.languages || []).join(","));

      if (newMod.img) formData.append("img", newMod.img);
      formData.append("role", "moderator");

      await axios.post(`${API_BASE}/moderators`, formData, {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
      });

      setNewMod(null);
      setNewTimeFrom("");
      setNewTimeTo("");
      fetchMods();
    } catch (err) {
      console.error("Error adding moderator:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add moderator");
    }
  };

  const startEdit = (mod) => {
    setEditMod({
      ...mod,
      specialities: Array.isArray(mod.specialities) ? mod.specialities : (mod.specialities || []),
      languages: Array.isArray(mod.languages) ? mod.languages : (mod.languages || []),
      img: undefined,
      password: "",
    });
    const { from, to } = parseTimeRange(mod.time);
    setEditTimeFrom(from);
    setEditTimeTo(to);
    setEditImgFile(null);
  };

  const handleUpdate = async () => {
    if (!editMod?._id) return;
    
    // Validation
    if (!editMod.fullName || !editMod.email) {
      alert("Please fill in all required fields (Name, Email)");
      return;
    }
    
    try {
      const formData = new FormData();
      const time = buildTimeRange(editTimeFrom, editTimeTo);

      ["fullName", "title", "availability", "experience", "email"].forEach((k) =>
        formData.append(k, editMod[k] || "")
      );
      if (time) formData.append("time", time);
      if (editMod.password) formData.append("password", editMod.password);

      formData.append("specialities", (editMod.specialities || []).join(","));
      formData.append("languages", (editMod.languages || []).join(","));

      if (editImgFile) formData.append("img", editImgFile);

      await axios.put(`${API_BASE}/moderators/${editMod._id}`, formData, {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
      });

      setEditMod(null);
      setEditImgFile(null);
      setEditTimeFrom("");
      setEditTimeTo("");
      fetchMods();
    } catch (err) {
      console.error("Error updating moderator:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update moderator");
    }
  };

  // Filter and sort moderators
  const filteredMods = useMemo(() => {
    let result = mods;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(mod => 
        mod.fullName.toLowerCase().includes(term) ||
        mod.email.toLowerCase().includes(term) ||
        mod.specialities.some(s => s.toLowerCase().includes(term)) ||
        mod.languages.some(l => l.toLowerCase().includes(term))
      );
    }
    
    // Filter by availability
    if (availabilityFilter !== "all") {
      result = result.filter(mod => mod.availability === availabilityFilter);
    }
    
    // Sort
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortBy === "availability") {
      result = [...result].sort((a, b) => a.availability.localeCompare(b.availability));
    }
    
    return result;
  }, [mods, searchTerm, availabilityFilter, sortBy]);

  return (
    <div className="moderators-page container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0">Moderator Management</h2>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => {
            setNewMod({ ...emptyNewMod });
            setNewTimeFrom("");
            setNewTimeTo("");
          }}
        >
          <i className="bi bi-plus-circle me-2"></i> Add Moderator
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="stat-card card bg-primary text-white shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">
                  <i className="bi bi-people-fill fs-1"></i>
                </div>
                <div>
                  <h6 className="card-title mb-0">Total Moderators</h6>
                  <h3 className="mb-0">{stats.total}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card card bg-success text-white shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">
                  <i className="bi bi-check-circle-fill fs-1"></i>
                </div>
                <div>
                  <h6 className="card-title mb-0">Available</h6>
                  <h3 className="mb-0">{stats.available}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card card bg-warning text-white shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">
                  <i className="bi bi-exclamation-circle-fill fs-1"></i>
                </div>
                <div>
                  <h6 className="card-title mb-0">Busy</h6>
                  <h3 className="mb-0">{stats.busy}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Search Moderators</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, specialities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Filter by Availability</label>
              <select
                className="form-select"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {availabilityOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Sort By</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="availability">Availability</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading moderators...</p>
        </div>
      ) : filteredMods.length === 0 ? (
        <div className="empty-card card p-5 text-center text-muted">
          <i className="bi bi-people fs-1 mb-3 d-block"></i>
          <h4>No moderators found</h4>
          <p>Try adjusting your search or filters, or add a new moderator.</p>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: 60 }}></th>
                  <th>Name & Title</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Working Hours</th>
                  <th>Experience</th>
                  <th>Specialities</th>
                  <th>Languages</th>
                  <th style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMods.map((mod) => {
                  const avatar = bufferToDataUrl(mod.img) || "";
                  const availabilityClass = mod.availability === "Available" ? "badge bg-success" : 
                                          mod.availability === "Busy" ? "badge bg-warning" :
                                          mod.availability === "Away" ? "badge bg-secondary" :
                                          mod.availability === "On Leave" ? "badge bg-danger" : "badge bg-light text-dark";
                  return (
                    <tr key={mod._id}>
                      <td>
                        <div className="avatar position-relative">
                          {avatar ? (
                            <img src={avatar} alt="avatar" className="rounded-circle" />
                          ) : (
                            <div className="avatar-fallback rounded-circle d-flex align-items-center justify-content-center">
                              {mod.fullName ? mod.fullName.charAt(0).toUpperCase() : 'M'}
                            </div>
                          )}
                          <span className={`status-indicator ${mod.availability === "Available" ? "online" : mod.availability === "Busy" ? "busy" : "offline"}`}></span>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">{mod.fullName}</div>
                        <div className="text-muted small">{mod.title || "Moderator"}</div>
                      </td>
                      <td>
                        <div>{mod.email}</div>
                        {mod.phone && <div className="text-muted small">{mod.phone}</div>}
                      </td>
                      <td>
                        <span className={availabilityClass}>
                          {mod.availability || "Unknown"}
                        </span>
                      </td>
                      <td>{mod.time ? mod.time.replace("-", " to ") : "-"}</td>
                      <td>{mod.experience || "-"}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {(mod.specialities || []).slice(0, 2).map((spec, i) => (
                            <span key={i} className="badge bg-light text-dark">{spec}</span>
                          ))}
                          {(mod.specialities || []).length > 2 && (
                            <span className="badge bg-light text-dark">+{(mod.specialities || []).length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {(mod.languages || []).slice(0, 2).map((lang, i) => (
                            <span key={i} className="badge bg-info text-dark">{lang}</span>
                          ))}
                          {(mod.languages || []).length > 2 && (
                            <span className="badge bg-light text-dark">+{(mod.languages || []).length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => startEdit(mod)}
                            title="Edit moderator"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDelete(mod._id)}
                            title="Delete moderator"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Form Modal */}
      {newMod && (
        <div className="modal-backdrop show">
          <div className="modal d-block">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Moderator</h5>
                  <button type="button" className="btn-close" onClick={() => setNewMod(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label required">Full Name</label>
                      <input
                        className="form-control"
                        value={newMod.fullName}
                        onChange={(e) => setNewMod({ ...newMod, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        value={newMod.title}
                        onChange={(e) => setNewMod({ ...newMod, title: e.target.value })}
                        placeholder="e.g., Senior Therapist"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Availability</label>
                      <select
                        className="form-select"
                        value={newMod.availability}
                        onChange={(e) => setNewMod({ ...newMod, availability: e.target.value })}
                      >
                        <option value="">Select availability</option>
                        {availabilityOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Working Time From</label>
                      <input
                        type="time"
                        className="form-control"
                        value={newTimeFrom}
                        onChange={(e) => setNewTimeFrom(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Working Time To</label>
                      <input
                        type="time"
                        className="form-control"
                        value={newTimeTo}
                        onChange={(e) => setNewTimeTo(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Experience</label>
                      <select
                        className="form-select"
                        value={newMod.experience}
                        onChange={(e) => setNewMod({ ...newMod, experience: e.target.value })}
                      >
                        <option value="">Select experience level</option>
                        {experienceOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label required">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newMod.email}
                        onChange={(e) => setNewMod({ ...newMod, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label required">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newMod.password}
                        onChange={(e) => setNewMod({ ...newMod, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Profile Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setNewMod({ ...newMod, img: e.target.files?.[0] || null })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Specialities</label>
                      <select
                        className="form-select"
                        multiple
                        value={newMod.specialities}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          setNewMod({ ...newMod, specialities: selected });
                        }}
                        size="3"
                      >
                        {commonSpecialities.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                      <div className="form-text">Hold Ctrl/Cmd to select multiple</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Languages</label>
                      <select
                        className="form-select"
                        multiple
                        value={newMod.languages}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          setNewMod({ ...newMod, languages: selected });
                        }}
                        size="3"
                      >
                        {commonLanguages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <div className="form-text">Hold Ctrl/Cmd to select multiple</div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setNewMod(null)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleAdd}>
                    Add Moderator
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editMod && (
        <div className="modal-backdrop show">
          <div className="modal d-block">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Moderator</h5>
                  <button type="button" className="btn-close" onClick={() => setEditMod(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label required">Full Name</label>
                      <input
                        className="form-control"
                        value={editMod.fullName || ""}
                        onChange={(e) => setEditMod({ ...editMod, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        value={editMod.title || ""}
                        onChange={(e) => setEditMod({ ...editMod, title: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Availability</label>
                      <select
                        className="form-select"
                        value={editMod.availability || ""}
                        onChange={(e) => setEditMod({ ...editMod, availability: e.target.value })}
                      >
                        <option value="">Select availability</option>
                        {availabilityOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Working Time From</label>
                      <input
                        type="time"
                        className="form-control"
                        value={editTimeFrom}
                        onChange={(e) => setEditTimeFrom(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Working Time To</label>
                      <input
                        type="time"
                        className="form-control"
                        value={editTimeTo}
                        onChange={(e) => setEditTimeTo(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Experience</label>
                      <select
                        className="form-select"
                        value={editMod.experience || ""}
                        onChange={(e) => setEditMod({ ...editMod, experience: e.target.value })}
                      >
                        <option value="">Select experience level</option>
                        {experienceOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label required">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editMod.email || ""}
                        onChange={(e) => setEditMod({ ...editMod, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={editMod.password || ""}
                        onChange={(e) => setEditMod({ ...editMod, password: e.target.value })}
                        placeholder="Leave blank to keep current password"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Profile Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setEditImgFile(e.target.files?.[0] || null)}
                      />
                      <div className="form-text">Select a new image to replace the current one</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Specialities</label>
                      <select
                        className="form-select"
                        multiple
                        value={editMod.specialities}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          setEditMod({ ...editMod, specialities: selected });
                        }}
                        size="3"
                      >
                        {commonSpecialities.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                      <div className="form-text">Hold Ctrl/Cmd to select multiple</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Languages</label>
                      <select
                        className="form-select"
                        multiple
                        value={editMod.languages}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          setEditMod({ ...editMod, languages: selected });
                        }}
                        size="3"
                      >
                        {commonLanguages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <div className="form-text">Hold Ctrl/Cmd to select multiple</div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditMod(null)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorsTab;