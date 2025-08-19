import "../styles/ThemeToggle.scss";

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <label className="theme-switch">
      <input
        id="themeToggle"
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <span className="slider"></span>
    </label>
  );
}

export default ThemeToggle;
