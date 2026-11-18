'use client';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [theme, setTheme] = useState('dark');
    const [posterMode, setPosterMode] = useState('cover');
    const [listGrouping, setListGrouping] = useState('with-separators');
    const [quickAccess, setQuickAccess] = useState('enabled');
    const [leaderboard, setLeaderboard] = useState('enabled');
    const [syncMode, setSyncMode] = useState('merge');
    const [timezone, setTimezone] = useState('auto');
    const [mounted, setMounted] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [detectedTz, setDetectedTz] = useState('');

    useEffect(() => {
        setTheme(localStorage.getItem('theme') || 'dark');
        setPosterMode(localStorage.getItem('posterDisplayMode') || 'cover');
        setListGrouping(localStorage.getItem('listGroupingMode') || 'with-separators');
        setQuickAccess(localStorage.getItem('quickAccessEnabled') !== 'false' ? 'enabled' : 'disabled');
        setLeaderboard(localStorage.getItem('leaderboardEnabled') !== 'false' ? 'enabled' : 'disabled');
        setSyncMode(localStorage.getItem('syncMode') || 'merge');
        setTimezone(localStorage.getItem('appTimezone') || 'auto');
        setDetectedTz(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown');
        setMounted(true);
    }, []);

    const changeTheme = (val: string) => {
        setTheme(val);
        localStorage.setItem('theme', val);
        document.documentElement.setAttribute('data-theme', val);
    };

    const changePosterMode = (val: string) => {
        setPosterMode(val);
        localStorage.setItem('posterDisplayMode', val);
    };

    const changeListGrouping = (val: string) => {
        setListGrouping(val);
        localStorage.setItem('listGroupingMode', val);
    };

    const changeQuickAccess = (val: string) => {
        setQuickAccess(val);
        localStorage.setItem('quickAccessEnabled', val === 'enabled' ? 'true' : 'false');
    };

    const changeLeaderboard = (val: string) => {
        setLeaderboard(val);
        localStorage.setItem('leaderboardEnabled', val === 'enabled' ? 'true' : 'false');
    };

    const changeSyncMode = (val: string) => {
        setSyncMode(val);
        localStorage.setItem('syncMode', val);
    };

    const changeTimezone = (val: string) => {
        setTimezone(val);
        localStorage.setItem('appTimezone', val);
    };

    const resetToDefaults = () => {
        changeTheme('dark');
        changePosterMode('cover');
        changeListGrouping('with-separators');
        changeQuickAccess('enabled');
        changeLeaderboard('enabled');
        changeSyncMode('merge');
        changeTimezone('auto');
        setShowResetModal(false);
    };

    if (!mounted) return <div className="container"><div style={{padding: '40px', textAlign: 'center', color: 'var(--silver)'}}>Loading...</div></div>;

    const themes = [
        { id: 'dark', name: 'Dark (Default)', desc: 'Dark background with light text. Easy on the eyes in low-light environments.', previewClass: 'dark-preview' },
        { id: 'light', name: 'Light', desc: 'Light background with dark text. Better for bright environments and daytime use.', previewClass: 'light-preview' },
        { id: 'netflix', name: 'Netflix', desc: 'Inspired by Netflix with deep blacks and red accents. Perfect for a cinematic feel.', previewClass: 'netflix-preview' },
        { id: 'prime', name: 'Prime', desc: 'Amazon Prime inspired with dark blue tones and cyan accents. Sleek and modern.', previewClass: 'prime-preview' },
    ];

    return (
        <div className="container">
            <header>
                <h1>Settings</h1>
                <p>Customize your Watchly experience</p>
                <button className="add-btn" style={{marginTop: '15px'}} onClick={() => setShowResetModal(true)}>Reset to Defaults</button>
            </header>

            <main>
                <div className="settings-container">

                    {/* Theme Setting */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <h3>Theme</h3>
                            <p>Choose your preferred color scheme for the entire application</p>
                        </div>
                        <div className="display-options">
                            {themes.map(t => (
                                <label key={t.id} className={`display-option ${theme === t.id ? 'selected' : ''}`}>
                                    <input type="radio" name="theme" value={t.id} checked={theme === t.id} onChange={() => changeTheme(t.id)} />
                                    <div className={`option-preview theme-preview ${t.previewClass}`}>
                                        <div className="theme-demo">
                                            <div className="theme-header"></div>
                                            <div className="theme-content">
                                                <div className="theme-card"></div>
                                                <div className="theme-card"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="option-label">
                                        <span className="option-name">{t.name}</span>
                                        <span className="option-desc">{t.desc}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Poster Display Mode */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <h3>Poster Display Mode</h3>
                            <p>Choose how movie and show posters are displayed in detail views</p>
                        </div>
                        <div className="display-options">
                            <label className={`display-option ${posterMode === 'cover' ? 'selected' : ''}`}>
                                <input type="radio" name="posterMode" value="cover" checked={posterMode === 'cover'} onChange={() => changePosterMode('cover')} />
                                <div className="option-preview cover-preview">
                                    <div className="preview-poster cover-poster">
                                        <div className="preview-img-wrap cover-wrap">
                                            <div className="preview-img-inner"></div>
                                        </div>
                                    </div>
                                    <div className="preview-lines">
                                        <div className="preview-line w80"></div>
                                        <div className="preview-line w50"></div>
                                        <div className="preview-line w95"></div>
                                        <div className="preview-line w70"></div>
                                    </div>
                                </div>
                                <div className="option-label">
                                    <span className="option-name">Crop to Fill (Default)</span>
                                    <span className="option-desc">Poster fills entire space, may crop top/bottom or sides to maintain aspect ratio</span>
                                </div>
                            </label>
                            <label className={`display-option ${posterMode === 'contain' ? 'selected' : ''}`}>
                                <input type="radio" name="posterMode" value="contain" checked={posterMode === 'contain'} onChange={() => changePosterMode('contain')} />
                                <div className="option-preview contain-preview">
                                    <div className="preview-poster contain-poster">
                                        <div className="preview-img-wrap contain-wrap">
                                            <div className="preview-img-inner"></div>
                                        </div>
                                    </div>
                                    <div className="preview-lines">
                                        <div className="preview-line w80"></div>
                                        <div className="preview-line w50"></div>
                                        <div className="preview-line w95"></div>
                                        <div className="preview-line w70"></div>
                                    </div>
                                </div>
                                <div className="option-label">
                                    <span className="option-name">Show Full Poster</span>
                                    <span className="option-desc">Entire poster visible with no cropping, dark bars may appear above/below or on sides</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* List Grouping */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <h3>List Grouping</h3>
                            <p>Choose how your watchlist items are organized on the main page</p>
                        </div>
                        <div className="display-options">
                            <label className={`display-option ${listGrouping === 'with-separators' ? 'selected' : ''}`}>
                                <input type="radio" name="listGrouping" value="with-separators" checked={listGrouping === 'with-separators'} onChange={() => changeListGrouping('with-separators')} />
                                <div className="option-preview grouping-preview">
                                    <div className="preview-group">
                                        <div className="preview-separator">A</div>
                                        <div className="preview-items">
                                            <div className="preview-item"></div>
                                            <div className="preview-item"></div>
                                        </div>
                                    </div>
                                    <div className="preview-group">
                                        <div className="preview-separator">B</div>
                                        <div className="preview-items">
                                            <div className="preview-item"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="option-label">
                                    <span className="option-name">With Section Headers</span>
                                    <span className="option-desc">Show alphabetical separators like &quot;0-9&quot;, &quot;A&quot;, &quot;B&quot;, etc. to organize your list</span>
                                </div>
                            </label>
                            <label className={`display-option ${listGrouping === 'continuous' ? 'selected' : ''}`}>
                                <input type="radio" name="listGrouping" value="continuous" checked={listGrouping === 'continuous'} onChange={() => changeListGrouping('continuous')} />
                                <div className="option-preview grouping-preview">
                                    <div className="preview-continuous">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="preview-item"></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="option-label">
                                    <span className="option-name">Continuous List</span>
                                    <span className="option-desc">Hide section headers for a clean, uninterrupted list (items still sorted alphabetically)</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <h3>Quick Access</h3>
                            <p>Show a dedicated section for pinned shows and movies at the top of your home page</p>
                        </div>
                        <div className="display-options">
                            <label className={`display-option ${quickAccess === 'enabled' ? 'selected' : ''}`}>
                                <input type="radio" name="quickAccess" value="enabled" checked={quickAccess === 'enabled'} onChange={() => changeQuickAccess('enabled')} />
                                <div className="option-label">
                                    <span className="option-name">Enabled (Default)</span>
                                    <span className="option-desc">Display a dedicated section on the home page for pinned items. Shows are automatically removed when marked as watched.</span>
                                </div>
                            </label>
                            <label className={`display-option ${quickAccess === 'disabled' ? 'selected' : ''}`}>
                                <input type="radio" name="quickAccess" value="disabled" checked={quickAccess === 'disabled'} onChange={() => changeQuickAccess('disabled')} />
                                <div className="option-label">
                                    <span className="option-name">Disabled</span>
                                    <span className="option-desc">Hide the Quick Access section from the home page. Your pinned items are preserved if you re-enable it later.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <h3>Leaderboard</h3>
                            <p>Enable or disable the leaderboard feature for ranking your favorite shows and movies</p>
                        </div>
                        <div className="display-options">
                            <label className={`display-option ${leaderboard === 'enabled' ? 'selected' : ''}`}>
                                <input type="radio" name="leaderboard" value="enabled" checked={leaderboard === 'enabled'} onChange={() => changeLeaderboard('enabled')} />
                                <div className="option-label">
                                    <span className="option-name">Enabled (Default)</span>
                                    <span className="option-desc">Show leaderboard in navigation and allow ranking items. Your rankings are preserved if you disable this.</span>
                                </div>
                            </label>
                            <label className={`display-option ${leaderboard === 'disabled' ? 'selected' : ''}`}>
                                <input type="radio" name="leaderboard" value="disabled" checked={leaderboard === 'disabled'} onChange={() => changeLeaderboard('disabled')} />
                                <div className="option-label">
                                    <span className="option-name">Disabled</span>
                                    <span className="option-desc">Hide leaderboard from navigation and pages. Your ranked list is preserved if you re-enable it later.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Backup Sync Mode */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <h3>Backup Sync Mode</h3>
                            <p>Choose how data is synced between devices when using GitHub Gist backup</p>
                        </div>
                        <div className="display-options">
                            <label className={`display-option ${syncMode === 'merge' ? 'selected' : ''}`}>
                                <input type="radio" name="syncMode" value="merge" checked={syncMode === 'merge'} onChange={() => changeSyncMode('merge')} />
                                <div className="option-label">
                                    <span className="option-name">Merge Mode (Smart Sync) - Default</span>
                                    <span className="option-desc">Intelligently merges data from both devices using timestamps. New shows added on either device are combined. Deletions are tracked and synced. Conflicts resolved by using the newest version. Best for multi-device usage.</span>
                                </div>
                            </label>
                            <label className={`display-option ${syncMode === 'replace' ? 'selected' : ''}`}>
                                <input type="radio" name="syncMode" value="replace" checked={syncMode === 'replace'} onChange={() => changeSyncMode('replace')} />
                                <div className="option-label">
                                    <span className="option-name">Replace Mode</span>
                                    <span className="option-desc">When syncing, remote backup completely replaces local data. Simple and reliable, but make sure to backup before syncing to avoid data loss. Best when using one primary device.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Timezone */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <h3>Timezone</h3>
                            <p>Choose your timezone for accurate time display in history</p>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            <select
                                value={timezone}
                                onChange={(e) => changeTimezone(e.target.value)}
                                style={{padding: '12px', background: 'var(--surface)', color: 'var(--light)', border: '1px solid rgba(195,199,206,0.2)', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer'}}
                            >
                                <option value="auto">Auto-detect (Current: {detectedTz})</option>
                                <optgroup label="Americas">
                                    <option value="America/New_York">Eastern Time (New York)</option>
                                    <option value="America/Chicago">Central Time (Chicago)</option>
                                    <option value="America/Denver">Mountain Time (Denver)</option>
                                    <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
                                    <option value="America/Anchorage">Alaska Time (Anchorage)</option>
                                    <option value="America/Honolulu">Hawaii Time (Honolulu)</option>
                                    <option value="America/Toronto">Eastern Time (Toronto)</option>
                                    <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                                    <option value="America/Mexico_City">Central Time (Mexico City)</option>
                                    <option value="America/Sao_Paulo">Brasilia Time</option>
                                    <option value="America/Argentina/Buenos_Aires">Argentina Time</option>
                                </optgroup>
                                <optgroup label="Europe">
                                    <option value="Europe/London">London (GMT/BST)</option>
                                    <option value="Europe/Paris">Paris (CET/CEST)</option>
                                    <option value="Europe/Berlin">Berlin (CET/CEST)</option>
                                    <option value="Europe/Madrid">Madrid (CET/CEST)</option>
                                    <option value="Europe/Rome">Rome (CET/CEST)</option>
                                    <option value="Europe/Amsterdam">Amsterdam (CET/CEST)</option>
                                    <option value="Europe/Brussels">Brussels (CET/CEST)</option>
                                    <option value="Europe/Vienna">Vienna (CET/CEST)</option>
                                    <option value="Europe/Stockholm">Stockholm (CET/CEST)</option>
                                    <option value="Europe/Athens">Athens (EET/EEST)</option>
                                    <option value="Europe/Moscow">Moscow (MSK)</option>
                                </optgroup>
                                <optgroup label="Asia">
                                    <option value="Asia/Dubai">Dubai (GST)</option>
                                    <option value="Asia/Karachi">Karachi (PKT)</option>
                                    <option value="Asia/Kolkata">India (IST)</option>
                                    <option value="Asia/Dhaka">Bangladesh (BST)</option>
                                    <option value="Asia/Bangkok">Bangkok (ICT)</option>
                                    <option value="Asia/Singapore">Singapore (SGT)</option>
                                    <option value="Asia/Hong_Kong">Hong Kong (HKT)</option>
                                    <option value="Asia/Shanghai">China (CST)</option>
                                    <option value="Asia/Tokyo">Japan (JST)</option>
                                    <option value="Asia/Seoul">South Korea (KST)</option>
                                </optgroup>
                                <optgroup label="Oceania">
                                    <option value="Australia/Sydney">Sydney (AEDT/AEST)</option>
                                    <option value="Australia/Melbourne">Melbourne (AEDT/AEST)</option>
                                    <option value="Australia/Brisbane">Brisbane (AEST)</option>
                                    <option value="Australia/Perth">Perth (AWST)</option>
                                    <option value="Pacific/Auckland">Auckland (NZDT/NZST)</option>
                                </optgroup>
                                <optgroup label="Africa">
                                    <option value="Africa/Cairo">Cairo (EET)</option>
                                    <option value="Africa/Johannesburg">Johannesburg (SAST)</option>
                                    <option value="Africa/Lagos">Lagos (WAT)</option>
                                    <option value="Africa/Nairobi">Nairobi (EAT)</option>
                                </optgroup>
                            </select>
                            <p style={{color: 'var(--silver)', fontSize: '0.85rem', margin: 0}}>
                                Current time in selected timezone: <strong>{(() => {
                                    const tz = timezone === 'auto' ? detectedTz : timezone;
                                    try { return new Intl.DateTimeFormat('en-US', {timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true}).format(new Date()); }
                                    catch { return '--:-- --'; }
                                })()}</strong>
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="modal-overlay active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Reset to Defaults?</h2>
                        </div>
                        <div className="modal-body">
                            <p>This will reset all settings to their default values:</p>
                            <ul style={{margin: '15px 0', paddingLeft: '20px', color: 'var(--silver)', lineHeight: 1.8}}>
                                <li>Theme: Dark</li>
                                <li>Quick Access: Enabled</li>
                                <li>Leaderboard: Enabled</li>
                                <li>Backup Sync Mode: Merge Mode</li>
                                <li>List Grouping: With Section Headers</li>
                                <li>Poster Display: Crop to Fill</li>
                            </ul>
                            <p style={{color: 'var(--silver)', fontSize: '0.9rem'}}>Netflix, Prime, and Light themes will be reset to Dark.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-btn cancel-btn" onClick={() => setShowResetModal(false)}>Cancel</button>
                            <button className="modal-btn confirm-btn" onClick={resetToDefaults}>Reset to Defaults</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .settings-container { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; }
                .settings-card { padding: 30px 0; border-bottom: 1px solid rgba(195,199,206,0.15); }
                .settings-card:last-child { border-bottom: none; }
                .settings-card-header { margin-bottom: 24px; }
                .settings-card-header h3 { font-size: 1.2rem; font-weight: 700; color: var(--light); margin-bottom: 6px; }
                .settings-card-header p { font-size: 0.88rem; color: var(--silver); }
                .display-options { display: flex; flex-direction: column; gap: 14px; }
                .display-option { display: flex; align-items: center; gap: 18px; padding: 18px; border: 2px solid rgba(195,199,206,0.1); border-radius: 8px; cursor: pointer; transition: all 0.2s ease; background: transparent; }
                .display-option:hover { border-color: rgba(195,199,206,0.25); background: rgba(195,199,206,0.03); }
                .display-option input[type="radio"] { display: none; }
                .display-option.selected { border-color: var(--silver); background: rgba(195,199,206,0.05); }
                .display-option.selected .dark-preview { border: 2px solid #B3B3B3 !important; background: #141414 !important; }
                .display-option.selected .light-preview { border: 2px solid #fff !important; background: #E0E3E6 !important; }
                .display-option.selected .netflix-preview { border: 2px solid #E50914 !important; background: #141414 !important; }
                .display-option.selected .prime-preview { border: 2px solid #00A8E1 !important; background: #0F171E !important; }
                .dark-preview { background: #141414 !important; border: 2px solid #B3B3B3; }
                [data-theme="light"] .dark-preview { border: 2px solid #fff; }
                .light-preview { background: #E0E3E6 !important; border: 2px solid #fff; }
                [data-theme="light"] .light-preview { border: 2px solid #888; }
                .netflix-preview { background: #141414 !important; border: 2px solid #E50914; }
                .prime-preview { background: #0F171E !important; border: 2px solid #00A8E1; }
                .option-preview { display: flex; gap: 8px; flex-shrink: 0; background: var(--bg); border-radius: 8px; padding: 8px; width: 130px; height: 80px; align-items: center; }
                [data-theme="light"] .option-preview { background: #D5D8DB; }
                .preview-poster { flex-shrink: 0; width: 40px; height: 64px; border-radius: 4px; overflow: hidden; background: var(--surface); }
                .preview-img-wrap { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
                .cover-wrap .preview-img-inner { width: 110%; height: 100%; background: var(--accent); border-radius: 2px; opacity: 0.5; }
                .contain-wrap { flex-direction: column; background: var(--bg); }
                .contain-wrap .preview-img-inner { width: 90%; height: 78%; background: var(--accent); border-radius: 2px; opacity: 0.5; }
                .preview-lines { flex: 1; display: flex; flex-direction: column; gap: 5px; justify-content: center; }
                .preview-line { height: 4px; background: var(--muted); border-radius: 2px; opacity: 0.6; }
                .w50 { width: 50%; } .w70 { width: 70%; } .w80 { width: 80%; } .w95 { width: 95%; }
                .grouping-preview { flex-direction: column; gap: 4px; padding: 6px; overflow: hidden; }
                .preview-group { display: flex; flex-direction: column; gap: 2px; }
                .preview-separator { font-size: 8px; font-weight: bold; color: var(--silver); padding: 2px 0 1px 0; background: transparent; border-bottom: 1px solid var(--muted); border-radius: 0; width: 100%; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
                .preview-items { display: grid; grid-template-columns: repeat(3, 15px); gap: 2px; margin-top: 2px; justify-content: flex-start; }
                .preview-item { width: 15px; height: 20px; background: var(--surface); border-radius: 2px; border: 1px solid var(--muted); flex-shrink: 0; }
                .preview-continuous { display: grid; grid-template-columns: repeat(3, 15px); gap: 2px; margin-top: 2px; justify-content: flex-start; }
                .preview-continuous .preview-item { width: 15px; height: 20px; }
                .option-label { display: flex; flex-direction: column; gap: 4px; }
                .option-name { font-size: 1rem; font-weight: 700; color: var(--light); }
                .option-desc { font-size: 0.8rem; color: var(--silver); line-height: 1.45; }
                .theme-preview { width: 130px; height: 80px; border-radius: 6px; overflow: hidden; }
                .theme-demo { width: 100%; height: 100%; display: flex; flex-direction: column; }
                .theme-header { height: 20%; width: 100%; }
                .theme-content { flex: 1; padding: 4px; display: flex; flex-direction: column; gap: 3px; }
                .theme-card { flex: 1; border-radius: 3px; }
                .dark-preview .theme-demo { background: #141414; }
                .dark-preview .theme-header { background: #1F1F1F; border-bottom: 1px solid #B3B3B3; }
                .dark-preview .theme-card { background: #1F1F1F; border: 1px solid #B3B3B3; }
                .light-preview .theme-demo { background: #E0E3E6; }
                .light-preview .theme-header { background: #F5F5F5; border-bottom: 1px solid #fff; }
                .light-preview .theme-card { background: #F5F5F5; border: 1px solid #fff; }
                .netflix-preview .theme-demo { background: #141414; }
                .netflix-preview .theme-header { background: #141414; border-bottom: 1px solid #E50914; }
                .netflix-preview .theme-card { background: #1F1F1F; border: 1px solid #E50914; }
                .prime-preview .theme-demo { background: #0F171E; }
                .prime-preview .theme-header { background: #0F171E; border-bottom: 1px solid #00A8E1; }
                .prime-preview .theme-card { background: #1A2632; border: 1px solid #00A8E1; }
                .display-option.selected .dark-preview .theme-header { border-bottom: 1px solid #B3B3B3; }
                .display-option.selected .dark-preview .theme-card { border: 1px solid #B3B3B3; }
                .display-option.selected .light-preview .theme-header { border-bottom: 1px solid #fff; }
                .display-option.selected .light-preview .theme-card { border: 1px solid #fff; }
                .display-option.selected .netflix-preview .theme-header { border-bottom: 1px solid #E50914; }
                .display-option.selected .netflix-preview .theme-card { border: 1px solid #E50914; }
                .display-option.selected .prime-preview .theme-header { border-bottom: 1px solid #00A8E1; }
                .display-option.selected .prime-preview .theme-card { border: 1px solid #00A8E1; }
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10000; }
                .modal-content { background: var(--surface); border: 1px solid rgba(195,199,206,0.2); border-radius: 12px; max-width: 480px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
                .modal-header { padding: 24px 24px 16px 24px; border-bottom: 1px solid rgba(195,199,206,0.15); }
                .modal-header h2 { margin: 0; font-size: 1.3rem; font-weight: 700; color: var(--light); }
                .modal-body { padding: 20px 24px; }
                .modal-body p { margin: 0 0 10px 0; color: var(--light); font-size: 0.95rem; line-height: 1.6; }
                .modal-body ul { margin: 15px 0; padding-left: 20px; color: var(--silver); line-height: 1.8; }
                .modal-body ul li { font-size: 0.9rem; }
                .modal-footer { padding: 16px 24px 24px 24px; display: flex; gap: 12px; justify-content: flex-end; }
                .modal-btn { padding: 10px 24px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; outline: none; }
                .cancel-btn { background: transparent; color: var(--silver); border: 1px solid rgba(195,199,206,0.2); }
                .cancel-btn:hover { background: rgba(195,199,206,0.05); border-color: rgba(195,199,206,0.3); }
                .confirm-btn { background: var(--silver); color: var(--bg); }
                .confirm-btn:hover { background: var(--light); transform: translateY(-1px); }
                @media (max-width: 480px) {
                    .modal-content { width: 95%; }
                    .option-preview { width: 100px; height: 64px; }
                }
            `}</style>
        </div>
    );
}
