
import classes from "./AllModal.module.css"

const PropertiesItemModal = (props)=>{
    return (
        <div className={classes.detailsContainer}>
            <div className={classes.modalContainer}>
                <div className={`${classes.modal} ${classes.modal__forProperties}`}>
                    <div className={classes["modal__details"]}>
                        <h1 className={`${classes.modalTitle__addNewFolder} ${classes.propertiesModalTitle}`}>{props.propertiesInfo.itemType} Properties</h1>
                    </div>
                    <div className={classes.modalBody__forProperties}>
                        <div className={classes.propertiesContainer}>
                            <div className={classes.propertiesItem}>
                                <div className={classes.itemName}>Name</div>
                                <div className={classes.itemValue}>{props.propertiesInfo.itemName}</div>
                            </div>
                            <div className={classes.propertiesItem}>
                                <div className={classes.itemName}>Type</div>
                                <div className={classes.itemValue}>{props.propertiesInfo.itemType}</div>
                            </div>
                            <div className={classes.propertiesItem}>
                                <div className={classes.itemName}>Created On</div>
                                <div className={classes.itemValue}>{props.propertiesInfo.createdOn}</div>
                            </div>
                            <div className={classes.propertiesItem}>
                                <div className={classes.itemName}>Modified On</div>
                                <div className={classes.itemValue}>{props.propertiesInfo.modifiedOn}</div>
                            </div>
                            <div className={classes.propertiesItem}>
                                <div className={classes.itemName}>Size</div>
                                <div className={classes.itemValue}>{props.propertiesInfo.size}</div>
                            </div>
                        </div>
                        <div className={classes.modalBtnContainer}>
                            <button className={classes.cancelBtn} onClick={() => {
                                props.cancelBtnHandler("property")
                            }}>Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertiesItemModal