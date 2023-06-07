import {Fragment} from "react";
import classes from "./ServerResponse.module.css"
const ServerResponse = (props)=>{
    return (
            <Fragment>
            {
                props.isSuccessful &&
                <div className={classes.success}>
                    <i className={`${classes.fa} ${classes.b}}`}></i>
                    {props.message}
                    <i className={`${classes.fa} ${classes.p}}`}></i>
                </div>
            }
            {
                !props.isSuccessful &&
                <div className={classes.error}>
                    <i className={`${classes.fa} ${classes.b}}`}></i>
                    {props.message}
                    <i className={`${classes.fa} ${classes.p}}`}></i>
                </div>
            }

            </Fragment>


    )
}

export default ServerResponse