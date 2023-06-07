import classes from "./ErrorPage.module.css"

const ErrorPage = ()=>{
    return (
        <div className={classes.mainContainer}>
            <div className={classes.bodyContainer}>
            <div className={classes.bodyContent}>
                <h1 className={`${classes.h1Container} ${classes["next-error-h1"]}`}>404</h1>
                <div>
                    <h2 className={classes.h2Container}>This page could not be found.</h2>
                </div>
            </div>
        </div>
        </div>

    )
}

export default ErrorPage