// src/components/ModeratorsTab.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./ModeratorsTab.css"; // Custom CSS

const API_BASE = "http://localhost:5000/api/admin";

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
const commonLanguages = ["English", "Spanish", "French", "Arabic", "Hindi", "Mandarin", "German"];

const emptyNewMod = {
  fullName: "",
  title: "",
  availability: "",
  specialities: "",
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

  const [newMod, setNewMod] = useState(null);
  const [newTimeFrom, setNewTimeFrom] = useState("");
  const [newTimeTo, setNewTimeTo] = useState("");

  const [editMod, setEditMod] = useState(null);
  const [editTimeFrom, setEditTimeFrom] = useState("");
  const [editTimeTo, setEditTimeTo] = useState("");
  const [editImgFile, setEditImgFile] = useState(null);

  useEffect(() => {
    fetchMods();
  }, []);

  useEffect(() => {
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
      const res = await axios.get(`${API_BASE}/moderators`, { headers: authHeader });
      setMods(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch moderators");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this moderator?")) return;
    try {
      await axios.delete(`${API_BASE}/moderators/${id}`, { headers: authHeader });
      setMods(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete moderator");
    }
  };

  const handleAddOrUpdate = async (modData, isEdit = false) => {
    if (!modData.fullName || !modData.email || (!isEdit && !modData.password)) {
      alert("Please fill required fields");
      return;
    }
    try {
      const formData = new FormData();
      const time = buildTimeRange(isEdit ? editTimeFrom : newTimeFrom, isEdit ? editTimeTo : newTimeTo);

      ["fullName", "title", "availability", "experience", "email"].forEach(k =>
        formData.append(k, modData[k] || "")
      );
      if (!isEdit) formData.append("password", modData.password);
      if (time) formData.append("time", time);
      formData.append("specialities", modData.specialities || "");
      formData.append("languages", (modData.languages || []).join(","));
      if (modData.img) formData.append("img", modData.img);
      if (!isEdit) formData.append("role", "moderator");

      if (isEdit) {
        if (editImgFile) formData.append("img", editImgFile);
        await axios.put(`${API_BASE}/moderators/${modData._id}`, formData, { headers: { ...authHeader, "Content-Type": "multipart/form-data" } });
        setEditMod(null); setEditImgFile(null); setEditTimeFrom(""); setEditTimeTo("");
      } else {
        await axios.post(`${API_BASE}/moderators`, formData, { headers: { ...authHeader, "Content-Type": "multipart/form-data" } });
        setNewMod(null); setNewTimeFrom(""); setNewTimeTo("");
      }
      fetchMods();
    } catch (err) {
      console.error(err);
      alert("Failed to save moderator");
    }
  };

  const startEdit = (mod) => {
    setEditMod({
      ...mod,
      specialities: mod.specialities || "",
      languages: Array.isArray(mod.languages) ? mod.languages : [],
      img: undefined,
      password: "",
    });
    const { from, to } = parseTimeRange(mod.time);
    setEditTimeFrom(from);
    setEditTimeTo(to);
    setEditImgFile(null);
  };

  const filteredMods = useMemo(() => {
    let result = mods;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(mod =>
        mod.fullName.toLowerCase().includes(term) ||
        mod.email.toLowerCase().includes(term) ||
        (mod.specialities || "").toLowerCase().includes(term) ||
        (mod.languages || []).some(l => l.toLowerCase().includes(term))
      );
    }
    if (availabilityFilter !== "all") {
      result = result.filter(mod => mod.availability === availabilityFilter);
    }
    if (sortBy === "name") result = [...result].sort((a, b) => a.fullName.localeCompare(b.fullName));
    else if (sortBy === "availability") result = [...result].sort((a, b) => a.availability.localeCompare(b.availability));
    return result;
  }, [mods, searchTerm, availabilityFilter, sortBy]);

  return (
    <div className="users-page container py-4">
      {/* Header */}
      <div className="r mb-4 users-page container">
        <h2 lassName="mb-0">Moderator Management</h2>
        <button className="btn btn-primary" onClick={() => setNewMod({ ...emptyNewMod })}>
          Add Moderator
        </button>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-4"><div className="card text-white bg-primary p-3 mb-3"><h6>Total Moderators</h6><h3>{stats.total}</h3></div></div>
        <div className="col-md-4"><div className="card text-white bg-success p-3 mb-3"><h6>Available</h6><h3>{stats.available}</h3></div></div>
        <div className="col-md-4"><div className="card text-white bg-warning p-3 mb-3"><h6>Busy</h6><h3>{stats.busy}</h3></div></div>
      </div>

      {/* Search & Filter */}
      <div className="card mb-4 p-3">
        <div className="row g-3">
          <div className="col-md-6">
            <input className="form-control" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={availabilityFilter} onChange={e => setAvailabilityFilter(e.target.value)}>
              <option value="all">All Status</option>
              {availabilityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="availability">Availability</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? <div className="text-center py-5">Loading...</div> : (
        <div className="table-responsive card shadow-sm p-3 mb-4 ">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th></th><th>Name</th><th>Email</th><th>Status</th><th>Hours</th><th>Experience</th><th>Specialities</th><th>Languages</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMods.map(mod => {
                const avatar = bufferToDataUrl(mod.img);
                const availabilityClass = mod.availability === "Available" ? "badge bg-success" : mod.availability === "Busy" ? "badge bg-warning" : "badge bg-secondary";
                return (
                  <tr key={mod._id}>
                    <td>{avatar ? <img src={avatar} alt="avatar" className="rounded-circle" width={40} height={40} /> : <div className="avatar-fallback rounded-circle">{mod.fullName?.charAt(0)}</div>}</td>
                    <td>{mod.fullName}<br/><small>{mod.title || "Moderator"}</small></td>
                    <td>{mod.email}</td>
                    <td><span className={availabilityClass}>{mod.availability || "-"}</span></td>
                    <td>{mod.time?.replace("-", " to ") || "-"}</td>
                    <td>{mod.experience || "-"}</td>
                    <td>{mod.specialities || "-"}</td>
                    <td>{(mod.languages || []).join(", ")}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEdit(mod)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(mod._id)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit forms */}
      {newMod && <ModeratorForm mod={newMod} setMod={setNewMod} timeFrom={newTimeFrom} setTimeFrom={setNewTimeFrom} timeTo={newTimeTo} setTimeTo={setNewTimeTo} onSubmit={(data) => handleAddOrUpdate(data)} />}
      {editMod && <ModeratorForm mod={editMod} setMod={setEditMod} timeFrom={editTimeFrom} setTimeFrom={setEditTimeFrom} timeTo={editTimeTo} setTimeTo={setEditTimeTo} onSubmit={(data) => handleAddOrUpdate(data, true)} imgFile={editImgFile} setImgFile={setEditImgFile} />}
    </div>
  );
};

export default ModeratorsTab;

/** Form Component with text input for Specialities and checkbox for Languages */
const ModeratorForm = ({ mod, setMod, timeFrom, setTimeFrom, timeTo, setTimeTo, onSubmit, imgFile, setImgFile }) => {
  const commonLanguages = ["English", "Spanish", "French", "Arabic", "Hindi", "Mandarin", "German"];
  const toggleLanguage = (lang) => {
    const newLangs = mod.languages.includes(lang) ? mod.languages.filter(l => l !== lang) : [...mod.languages, lang];
    setMod({ ...mod, languages: newLangs });
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <div className="card-header d-flex justify-content-between"><h5>{mod._id ? "Edit" : "Add"} Moderator</h5><button className="btn-close" onClick={() => setMod(null)}></button></div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6"><label>Full Name</label><input className="form-control" value={mod.fullName || ""} onChange={e => setMod({...mod, fullName: e.target.value})} /></div>
          <div className="col-md-6"><label>Title</label><input className="form-control" value={mod.title || ""} onChange={e => setMod({...mod, title: e.target.value})} /></div>
          <div className="col-md-6"><label>Availability</label>
            <select className="form-select" value={mod.availability || ""} onChange={e => setMod({...mod, availability: e.target.value})}>
              <option value="">Select</option>
              {availabilityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="col-md-3"><label>From</label><input type="time" className="form-control" value={timeFrom || ""} onChange={e => setTimeFrom(e.target.value)} /></div>
          <div className="col-md-3"><label>To</label><input type="time" className="form-control" value={timeTo || ""} onChange={e => setTimeTo(e.target.value)} /></div>
          <div className="col-md-6"><label>Experience</label>
            <select className="form-select" value={mod.experience || ""} onChange={e => setMod({...mod, experience: e.target.value})}>
              <option value="">Select</option>
              {experienceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="col-md-6"><label>Email</label><input type="email" className="form-control" value={mod.email || ""} onChange={e => setMod({...mod, email: e.target.value})} /></div>
          {!mod._id && <div className="col-md-6"><label>Password</label><input type="password" className="form-control" value={mod.password || ""} onChange={e => setMod({...mod, password: e.target.value})} /></div>}
          <div className="col-md-6"><label>Profile Image</label><input type="file" accept="image/*" className="form-control" onChange={e => (mod._id ? setImgFile(e.target.files?.[0]) : setMod({...mod, img: e.target.files?.[0]}))} /></div>

          <div className="col-md-6"><label>Specialities (comma-separated)</label>
            <input className="form-control" value={mod.specialities || ""} onChange={e => setMod({...mod, specialities: e.target.value})} placeholder="e.g., Mental Health, Career"/>
          </div>

          <div className="col-md-6"><label>Languages</label>
            <div className="d-flex flex-wrap gap-2">
              {commonLanguages.map(lang => (
                <div className="form-check" key={lang}>
                  <input className="form-check-input" type="checkbox" id={`lang-${lang}`} checked={mod.languages.includes(lang)} onChange={() => toggleLanguage(lang)} />
                  <label className="form-check-label" htmlFor={`lang-${lang}`}>{lang}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-end gap-2">
        <button className="btn btn-secondary" onClick={() => setMod(null)}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSubmit(mod)}>{mod._id ? "Save Changes" : "Add Moderator"}</button>
      </div>
    </div>
  )
};
