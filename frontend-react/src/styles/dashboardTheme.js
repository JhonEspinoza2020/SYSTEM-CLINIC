export const theme = {
    pageBackground: {
        background: 'linear-gradient(165deg, #eef2f7 0%, #e8edf4 40%, #dbeafe 100%)',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(26, 54, 93, 0.08)',
        border: '1px solid rgba(148, 163, 184, 0.25)',
    },
    cardMuted: {
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        borderRadius: '14px',
        boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
        border: '1px solid #e2e8f0',
    },
    headerDark: {
        backgroundColor: '#1e293b',
        color: '#ffffff',
        borderBottom: '3px solid #00A8CC',
    },
    accent: '#00A8CC',
    navy: '#1A365D',
};

export const sectionTitle = (color = theme.navy) => ({
    color,
    margin: '0 0 15px 0',
    fontSize: '14px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    borderLeft: `4px solid ${theme.accent}`,
    paddingLeft: '10px',
});
