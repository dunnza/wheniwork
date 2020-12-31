import cx from "classnames";
import styles from "./Button.module.css";

function Button({ children, className, color, size, type, ...props }) {
  const finalClassName = cx(styles.btn, styles[color], styles[size], className);

  return (
    <button className={finalClassName} type={type ?? "button"} {...props}>
      {children}
    </button>
  );
}

export default Button;
