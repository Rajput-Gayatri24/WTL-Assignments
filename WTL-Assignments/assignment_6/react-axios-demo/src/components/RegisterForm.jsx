import React, { useState } from 'react';
import './RegisterForm.css';

const INITIAL_STATE = {
  fullName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  gender: 'female',
  country: 'US',
  accountType: 'developer',
  bio: '',
  skills: [],
  newsletter: true,
  termsAccepted: false
};

const COUNTRY_OPTIONS = [
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'IN', label: '🇮🇳 India' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'UK', label: '🇬🇧 United Kingdom' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'AU', label: '🇦🇺 Australia' }
];

const SKILL_OPTIONS = [
  'React.js', 'JavaScript ES6+', 'Node.js', 'CSS3 / Tailwind', 'Python', 'TypeScript'
];

export default function RegisterForm() {
  // 1. Controlled State Object for Form Fields
  const [formData, setFormData] = useState(INITIAL_STATE);

  // 2. Controlled Error State
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // 3. UI Helper States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'inspector'

  // Generic Controlled Change Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle controlled inputs based on type
    let newValue;
    if (type === 'checkbox' && name !== 'skills') {
      newValue = checked;
    } else if (name === 'skills') {
      // Checkbox array handling
      if (checked) {
        newValue = [...formData.skills, value];
      } else {
        newValue = formData.skills.filter((s) => s !== value);
      }
    } else {
      newValue = value;
    }

    const updatedFormData = { ...formData, [name]: newValue };
    setFormData(updatedFormData);

    // Validate on the fly if touched
    if (touched[name]) {
      validateField(name, newValue, updatedFormData);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value, formData);
  };

  // Field Level Validation Logic
  const validateField = (name, value, currentData) => {
    let errorMsg = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) errorMsg = 'Full Name is required.';
        else if (value.trim().length < 3) errorMsg = 'Name must be at least 3 characters.';
        break;

      case 'email':
        if (!value.trim()) errorMsg = 'Email address is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMsg = 'Please enter a valid email address.';
        break;

      case 'username':
        if (!value.trim()) errorMsg = 'Username is required.';
        else if (!/^[a-zA-Z0-9_]{3,16}$/.test(value)) errorMsg = '3-16 chars, letters/numbers/underscore only.';
        break;

      case 'password':
        if (!value) errorMsg = 'Password is required.';
        else if (value.length < 8) errorMsg = 'Password must be at least 8 characters.';
        break;

      case 'confirmPassword':
        if (!value) errorMsg = 'Please confirm your password.';
        else if (value !== currentData.password) errorMsg = 'Passwords do not match.';
        break;

      case 'termsAccepted':
        if (!value) errorMsg = 'You must accept the terms & conditions.';
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg
    }));

    return !errorMsg;
  };

  // Calculate Password Strength Metrics
  const getPasswordMetrics = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#6b7280' };
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 50) return { score, label: 'Fair', color: '#f59e0b' };
    if (score <= 75) return { score, label: 'Good', color: '#3b82f6' };
    return { score, label: 'Strong', color: '#10b981' };
  };

  // Full Form Validation on Submit
  const validateForm = () => {
    const fieldsToValidate = ['fullName', 'email', 'username', 'password', 'confirmPassword', 'termsAccepted'];
    let isValid = true;
    const newErrors = {};
    const newTouched = {};

    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      const val = formData[field];
      let fieldError = '';

      if (field === 'fullName' && (!val || val.trim().length < 3)) fieldError = 'Full name must be at least 3 chars.';
      if (field === 'email' && (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))) fieldError = 'Valid email is required.';
      if (field === 'username' && (!val || !/^[a-zA-Z0-9_]{3,16}$/.test(val))) fieldError = 'Valid username is required.';
      if (field === 'password' && (!val || val.length < 8)) fieldError = 'Password must be at least 8 chars.';
      if (field === 'confirmPassword' && val !== formData.password) fieldError = 'Passwords do not match.';
      if (field === 'termsAccepted' && !val) fieldError = 'You must accept the terms.';

      if (fieldError) {
        newErrors[field] = fieldError;
        isValid = false;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API registration request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData(formData);
    }, 1200);
  };

  const handleReset = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
    setTouched({});
    setSubmittedData(null);
  };

  const passwordMetrics = getPasswordMetrics(formData.password);

  return (
    <div className="reg-wrapper">
      {/* Top Banner / Header */}
      <header className="reg-header">
        <span className="badge-react">REACT CONTROLLED COMPONENTS DEMO</span>
        <h1>User Registration System</h1>
        <p>Every field input is dynamically synced with React component state (<code>useState</code>)</p>

        {/* Navigation Tabs */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            📋 Registration Form
          </button>
          <button
            className={`tab-btn ${activeTab === 'inspector' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspector')}
          >
            🔍 Controlled State Inspector
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="reg-card">
        {activeTab === 'form' ? (
          <form className="reg-form" onSubmit={handleSubmit} noValidate>

            {/* Section 1: Personal Details */}
            <div className="form-section">
              <h3 className="section-title">👤 Personal Information</h3>

              <div className="grid-2col">
                {/* Full Name Controlled Input */}
                <div className={`form-field ${errors.fullName && touched.fullName ? 'has-error' : ''}`}>
                  <label htmlFor="fullName">Full Name <span className="req">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.fullName && touched.fullName && (
                    <span className="error-text">⚠️ {errors.fullName}</span>
                  )}
                </div>

                {/* Email Controlled Input */}
                <div className={`form-field ${errors.email && touched.email ? 'has-error' : ''}`}>
                  <label htmlFor="email">Email Address <span className="req">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <span className="error-text">⚠️ {errors.email}</span>
                  )}
                </div>
              </div>

              <div className="grid-2col">
                {/* Username Controlled Input */}
                <div className={`form-field ${errors.username && touched.username ? 'has-error' : ''}`}>
                  <label htmlFor="username">Username <span className="req">*</span></label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">@</span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="johndoe99"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.username && touched.username && (
                    <span className="error-text">⚠️ {errors.username}</span>
                  )}
                </div>

                {/* Country Controlled Select */}
                <div className="form-field">
                  <label htmlFor="country">Country of Residence</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Account Security */}
            <div className="form-section">
              <h3 className="section-title">🔒 Account Security</h3>

              <div className="grid-2col">
                {/* Password Controlled Input */}
                <div className={`form-field ${errors.password && touched.password ? 'has-error' : ''}`}>
                  <label htmlFor="password">Password <span className="req">*</span></label>
                  <div className="input-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="btn-toggle-pass"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '👁️' : '🙈'}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="strength-bar-container">
                      <div
                        className="strength-bar-fill"
                        style={{ width: `${passwordMetrics.score}%`, backgroundColor: passwordMetrics.color }}
                      ></div>
                      <span className="strength-label" style={{ color: passwordMetrics.color }}>
                        Strength: {passwordMetrics.label}
                      </span>
                    </div>
                  )}

                  {errors.password && touched.password && (
                    <span className="error-text">⚠️ {errors.password}</span>
                  )}
                </div>

                {/* Confirm Password Controlled Input */}
                <div className={`form-field ${errors.confirmPassword && touched.confirmPassword ? 'has-error' : ''}`}>
                  <label htmlFor="confirmPassword">Confirm Password <span className="req">*</span></label>
                  <div className="input-password-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="btn-toggle-pass"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <span className="error-text">⚠️ {errors.confirmPassword}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Preferences & Radio / Checkboxes */}
            <div className="form-section">
              <h3 className="section-title">⚙️ Account Role & Preferences</h3>

              {/* Radio Group: Gender */}
              <div className="form-field">
                <label>Gender Identification</label>
                <div className="radio-group">
                  {['female', 'male', 'other', 'prefer_not_to_say'].map((g) => (
                    <label key={g} className={`radio-label ${formData.gender === g ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                      />
                      <span className="capitalize">{g.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Radio Group: Account Type */}
              <div className="form-field">
                <label>Primary Account Role</label>
                <div className="radio-cards">
                  {[
                    { id: 'developer', title: '💻 Developer', desc: 'Building software & APIs' },
                    { id: 'designer', title: '🎨 UI/UX Designer', desc: 'Designing user experiences' },
                    { id: 'manager', title: '💼 Product Manager', desc: 'Leading teams & projects' }
                  ].map((role) => (
                    <label key={role.id} className={`role-card ${formData.accountType === role.id ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="accountType"
                        value={role.id}
                        checked={formData.accountType === role.id}
                        onChange={handleChange}
                      />
                      <div className="role-info">
                        <strong>{role.title}</strong>
                        <p>{role.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Checkbox Group: Skills */}
              <div className="form-field">
                <label>Technical Skills (Select multiple)</label>
                <div className="checkbox-grid">
                  {SKILL_OPTIONS.map((skill) => (
                    <label key={skill} className={`checkbox-pill ${formData.skills.includes(skill) ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        name="skills"
                        value={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={handleChange}
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Controlled Textarea: Bio */}
              <div className="form-field">
                <label htmlFor="bio">
                  Short Bio <span className="char-count">({formData.bio.length} / 200)</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  maxLength={200}
                  placeholder="Tell us a little bit about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Single Checkboxes: Newsletter & Terms */}
              <div className="checkbox-stack">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                  />
                  <span>Subscribe to monthly product updates & newsletter</span>
                </label>

                <label className={`checkbox-row ${errors.termsAccepted && touched.termsAccepted ? 'has-error-text' : ''}`}>
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a> <span className="req">*</span>
                  </span>
                </label>
                {errors.termsAccepted && touched.termsAccepted && (
                  <span className="error-text">⚠️ {errors.termsAccepted}</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button type="button" className="btn-reset" onClick={handleReset}>
                🔄 Clear & Reset Form
              </button>

              <button type="submit" className="btn-submit-reg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-small"></span> Registering Account...
                  </>
                ) : (
                  '🚀 Create Account'
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Live Inspector Tab */
          <div className="inspector-panel">
            <div className="inspector-header">
              <h3>⚡ Live Controlled Component State Inspector</h3>
              <p>Observe how React's <code>useState</code> updates in real-time as you type or interact with form inputs.</p>
            </div>

            <div className="inspector-grid">
              <div className="inspector-box">
                <span className="box-title">State Object (<code>formData</code>)</span>
                <pre className="code-display">{JSON.stringify(formData, null, 2)}</pre>
              </div>

              <div className="inspector-box">
                <span className="box-title">Validation Errors (<code>errors</code>)</span>
                <pre className="code-display">{JSON.stringify(errors, null, 2)}</pre>
              </div>
            </div>

            <div className="controlled-explanation">
              <h4>💡 How Controlled Components Work in React:</h4>
              <ul>
                <li><strong>State Single Source of Truth:</strong> Form input elements derive their value directly from React state: <code>value={'{formData.email}'}</code>.</li>
                <li><strong>Controlled Handler:</strong> Every input update fires an <code>onChange</code> event handler which updates state: <code>setFormData(...)</code>.</li>
                <li><strong>Instant Feedback:</strong> Real-time validation, character counts, and password strength respond immediately without manual DOM queries.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Submission Success Modal */}
      {submittedData && (
        <div className="modal-overlay" onClick={() => setSubmittedData(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🎉</div>
            <h2>Registration Successful!</h2>
            <p>Your user profile has been created via Controlled Components state.</p>

            <div className="submitted-summary">
              <div className="summary-item">
                <span>Name:</span> <strong>{submittedData.fullName}</strong>
              </div>
              <div className="summary-item">
                <span>Email:</span> <strong>{submittedData.email}</strong>
              </div>
              <div className="summary-item">
                <span>Username:</span> <strong>@{submittedData.username}</strong>
              </div>
              <div className="summary-item">
                <span>Role:</span> <strong className="capitalize">{submittedData.accountType}</strong>
              </div>
              <div className="summary-item">
                <span>Country:</span> <strong>{submittedData.country}</strong>
              </div>
              <div className="summary-item">
                <span>Skills:</span> <strong>{submittedData.skills.length > 0 ? submittedData.skills.join(', ') : 'None selected'}</strong>
              </div>
              <div className="summary-item">
                <span>Newsletter:</span> <strong>{submittedData.newsletter ? 'Subscribed' : 'No'}</strong>
              </div>
            </div>

            <button className="btn-close-modal" onClick={() => setSubmittedData(null)}>
              Done & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}