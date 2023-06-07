import classes from "./LoaderDotCircle.module.css"

const  LoaderDotCircle = ()=>{
    return (
        <div className={classes["circle-loader"]}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default LoaderDotCircle