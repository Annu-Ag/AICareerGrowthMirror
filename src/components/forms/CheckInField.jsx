export default function CheckInField({ label, value, onChange, placeholder, icon }) {
  return (
    <label className="block group">
      <span className="flex items-center gap-2 text-sm font-semibold text-fg">
        {icon && <span className="text-base">{icon}</span>}
        {label}
      </span>
      <textarea
        value={value}
        onChange={onChange}
        className="input-base mt-2 min-h-28 resize-y"
        placeholder={placeholder}
      />
    </label>
  )
}
