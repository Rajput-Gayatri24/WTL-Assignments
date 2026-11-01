import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Base API URL
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Controls & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(9);
  const [simulateError, setSimulateError] = useState(false);

  // Analytics & Interceptors Info
  const [apiStats, setApiStats] = useState({
    status: null,
    latency: null,
    method: 'GET',
    url: API_URL
  });

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activePost, setActivePost] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // 1. READ (GET) Request
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const targetUrl = simulateError
        ? 'https://jsonplaceholder.typicode.com/invalid-endpoint-404'
        : `${API_URL}?_limit=${limit}`;

      const response = await axios.get(targetUrl, {
        headers: { 'Custom-Header': 'React-Axios-Demo' }
      });

      const endTime = performance.now();
      setData(response.data);
      setApiStats({
        status: `${response.status} ${response.statusText || 'OK'}`,
        latency: Math.round(endTime - startTime),
        method: 'GET',
        url: targetUrl
      });
    } catch (err) {
      const endTime = performance.now();
      const statusMsg = err.response
        ? `${err.response.status} ${err.response.statusText || 'Error'}`
        : 'Network Error';
      
      setError(err.response?.data?.message || err.message || 'Failed to connect to server.');
      setApiStats({
        status: statusMsg,
        latency: Math.round(endTime - startTime),
        method: 'GET',
        url: err.config?.url || API_URL
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit, simulateError]);

  // 2. CREATE (POST) Request
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    setSubmitting(true);
    const startTime = performance.now();
    try {
      const response = await axios.post(API_URL, {
        title: formData.title,
        body: formData.body,
        userId: 1,
      });

      const endTime = performance.now();
      // Add newly created item to state
      const newPost = { ...response.data, id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1 };
      setData([newPost, ...data]);
      
      showToast(`Post #${newPost.id} created successfully! (HTTP ${response.status})`, 'success');
      setApiStats({
        status: `${response.status} Created`,
        latency: Math.round(endTime - startTime),
        method: 'POST',
        url: API_URL
      });

      setIsCreateOpen(false);
      setFormData({ title: '', body: '' });
    } catch (err) {
      showToast(err.message || 'Failed to create post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. UPDATE (PUT) Request
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    setSubmitting(true);
    const startTime = performance.now();
    try {
      const response = await axios.put(`${API_URL}/${activePost.id}`, {
        id: activePost.id,
        title: formData.title,
        body: formData.body,
        userId: activePost.userId || 1,
      });

      const endTime = performance.now();
      setData(data.map(item => item.id === activePost.id ? { ...item, ...response.data } : item));
      
      showToast(`Post #${activePost.id} updated successfully! (HTTP ${response.status})`, 'success');
      setApiStats({
        status: `${response.status} OK (Updated)`,
        latency: Math.round(endTime - startTime),
        method: 'PUT',
        url: `${API_URL}/${activePost.id}`
      });

      setIsEditOpen(false);
      setActivePost(null);
      setFormData({ title: '', body: '' });
    } catch (err) {
      showToast(err.message || 'Failed to update post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. DELETE Request
  const handleDeletePost = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Post #${id}?`)) return;

    const startTime = performance.now();
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      const endTime = performance.now();

      setData(data.filter(item => item.id !== id));
      showToast(`Post #${id} deleted! (HTTP ${response.status})`, 'success');
      setApiStats({
        status: `${response.status} OK (Deleted)`,
        latency: Math.round(endTime - startTime),
        method: 'DELETE',
        url: `${API_URL}/${id}`
      });
    } catch (err) {
      showToast(err.message || 'Failed to delete post', 'error');
    }
  };

  // Open Edit Modal
  const openEditModal = (post) => {
    setActivePost(post);
    setFormData({ title: post.title, body: post.body });
    setIsEditOpen(true);
  };

  // Open Detail Modal
  const openDetailModal = (post) => {
    setActivePost(post);
    setIsDetailOpen(true);
  };

  // Filtered posts for search
  const filteredData = data.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
              <p>{toast.message}</p>
            </div>
          )}

          {/* Header */}
          <header className="header">
            <div className="badge">AXIOS HTTP CLIENT DEMO</div>
            <h1>React & Axios Data Hub</h1>
            <p>Perform asynchronous CRUD requests, handle states, and monitor HTTP metrics seamlessly</p>
          </header>

          {/* API Metrics Banner */}
          <section className="metrics-banner">
        <div className="metric-item">
          <span className="metric-label">HTTP Method</span>
          <span className={`method-tag method-${apiStats.method.toLowerCase()}`}>{apiStats.method}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Status Code</span>
          <span className={`status-tag ${error ? 'status-error' : 'status-ok'}`}>
            {apiStats.status || 'Ready'}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Latency</span>
          <span className="metric-value">{apiStats.latency !== null ? `${apiStats.latency} ms` : '--'}</span>
        </div>
        <div className="metric-item metric-url">
          <span className="metric-label">Endpoint</span>
          <span className="url-value" title={apiStats.url}>{apiStats.url}</span>
        </div>
      </section>

      {/* Control Bar */}
      <section className="control-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="controls-group">
          <label className="limit-selector">
            <span>Show:</span>
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={6}>6 items</option>
              <option value={9}>9 items</option>
              <option value={12}>12 items</option>
              <option value={15}>15 items</option>
            </select>
          </label>

          <button
            className={`toggle-error-btn ${simulateError ? 'active' : ''}`}
            onClick={() => setSimulateError(!simulateError)}
            title="Toggle error to test Axios error handling"
          >
            {simulateError ? '⚠️ Error Mode ON' : '⚡ Simulate Error'}
          </button>

          <button className="refresh-btn" onClick={fetchData} disabled={loading}>
            <span className={loading ? 'spinning' : ''}>🔄</span> Refresh
          </button>

          <button className="create-btn" onClick={() => { setFormData({ title: '', body: '' }); setIsCreateOpen(true); }}>
            ➕ Create Post
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="main-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching content with Axios...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <div className="error-icon">⚡</div>
            <h2>Axios Request Failed</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button className="retry-button" onClick={() => { setSimulateError(false); fetchData(); }}>
                Reset & Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No posts found</h3>
            <p>Try clearing your search query or creating a new post.</p>
          </div>
        )}

        {!loading && !error && filteredData.length > 0 && (
          <div className="grid">
            {filteredData.map((item) => (
              <div key={item.id} className="card">
                <div className="card-header">
                  <span className="card-tag">POST #{item.id}</span>
                  <div className="card-actions">
                    <button
                      className="icon-btn edit-btn"
                      title="Edit Post (PUT)"
                      onClick={() => openEditModal(item)}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn delete-btn"
                      title="Delete Post (DELETE)"
                      onClick={() => handleDeletePost(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h3 className="card-title" onClick={() => openDetailModal(item)} title={item.title}>
                  {item.title}
                </h3>
                <p className="card-body">{item.body}</p>

                <div className="card-footer">
                  <span className="read-more" onClick={() => openDetailModal(item)}>
                    View Details ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE POST MODAL */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Post (POST)</h2>
              <button className="close-btn" onClick={() => setIsCreateOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter post title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Body Content</label>
                <textarea
                  rows="4"
                  placeholder="Enter post body content..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Sending POST...' : 'Submit (axios.post)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT POST MODAL */}
      {isEditOpen && activePost && (
        <div className="modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Post #{activePost.id} (PUT)</h2>
              <button className="close-btn" onClick={() => setIsEditOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleUpdatePost}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Body Content</label>
                <textarea
                  rows="4"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Sending PUT...' : 'Save Changes (axios.put)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL VIEW MODAL */}
      {isDetailOpen && activePost && (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post #{activePost.id} Details</h2>
              <button className="close-btn" onClick={() => setIsDetailOpen(false)}>✕</button>
            </div>
            <div className="detail-body">
              <span className="card-tag">USER ID: {activePost.userId || 1}</span>
              <h3 className="detail-title">{activePost.title}</h3>
              <p className="detail-content">{activePost.body}</p>
              
              <div className="code-block-wrapper">
                <span className="code-label">JSON Payload</span>
                <pre className="code-block">
                  {JSON.stringify(activePost, null, 2)}
                </pre>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsDetailOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

