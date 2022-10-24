const Input = ({
  placeholder,
  name,
  type,
  value,
  handleChange,
  step,
  otherProps,
}) => (
  <input
    name={name}
    placeholder={placeholder}
    type={type}
    step={step || "0.0015"}
    value={value}
    onChange={handleChange}
    className="input-el"
    {...otherProps}
  />
);

export default Input;
