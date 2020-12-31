import cx from "classnames";
import styles from "./Input.module.css";

function Input({ className, type, ...props }) {
  const finalClassName = cx(styles.input, className);
  return <input className={finalClassName} type={type ?? "text"} {...props} />;
}

export default Input;
