export default function ProfileField({
  label,
  name,
  value,
  onChange,
  placeholder,
  hint,
  required,
  textarea,
  inputMode,
  maxLength,
}) {
  const id = `field-${name}`
  const charCount = typeof value === 'string' ? value.length : 0
  const isNearLimit = maxLength && charCount > maxLength * 0.85

  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-fg-secondary">
        {label}
        {required && <span className="text-accent">*</span>}
        {maxLength && (
          <span className={`ml-auto text-xs ${isNearLimit ? 'text-warning' : 'text-fg-muted'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          maxLength={maxLength}
          className="input-base mt-1.5 resize-y"
        />
      ) : (
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={name === 'name' ? 'name' : 'off'}
          className="input-base mt-1.5"
        />
      )}
      {hint && <p className="mt-1 text-xs text-fg-muted flex items-center gap-1"><span className="size-1 rounded-full bg-accent/40" />{hint}</p>}
    </div>
  )
}
