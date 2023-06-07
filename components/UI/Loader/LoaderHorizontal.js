
import classes from "./LoaderHorizontal.module.css"
const LoaderHorizontal = ()=>{
    return (
        <div className={classes["animated-background"]}>
            <div className={`${classes["background-masker"]}}`}></div>
        </div>
    )
}

export default LoaderHorizontal