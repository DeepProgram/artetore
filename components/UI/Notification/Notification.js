import classes from "./Notification.module.css"

const Notification = (props)=>{
    return (
        <div className={classes.notificationContainer}>
            <div className={classes.notificationText}>Already Selected {props.message} File
            <div> Checkbox</div></div>
            <div className={classes.hintText}>Try Deselecting All Folders</div>
        </div>
    )
}

export default Notification