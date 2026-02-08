function normalizeStatus(raw) {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim().toLowerCase();

  // Canonical statuses: shortlisted, selected, rejected
  if (s === 'shortlisted' || s === 'shortlist' || s === 'short listed') return 'shortlisted';
  if (s === 'selected' || s === 'hired' || s === 'offer' || s === 'offered') return 'selected';
  if (s === 'rejected' || s === 'reject' || s === 'not selected' || s === 'not_selected' || s === 'no') return 'rejected';

  // Allow some other common synonyms
  if (s === 'waiting' || s === 'pending' || s === 'under review') return 'shortlisted';

  // If it already matches canonical exactly
  if (['shortlisted', 'selected', 'rejected'].includes(s)) return s;

  // Unknown status
  return null;
}

module.exports = { normalizeStatus };
