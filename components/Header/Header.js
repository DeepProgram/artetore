import classes from "./Header.module.css"
import Link from "next/link";


const Header = ()=>{
    return (
        <div className={classes.header}>
            <Link href={"/"} className={classes.logo}>
                <div className={classes.logo__icon}></div>
                <div className={classes.logo__text}>ARTETORE</div>
            </Link>
            <div className={classes.navContainer}>
                <Link className={classes.artetoreYT} href={"https://www.youtube.com/@artetore"}
                     rel="noopener noreferrer" target="_blank"></Link>
                <Link className={classes.artetoreFB} href={"https://www.facebook.com/artetore"}
                     rel="noopener noreferrer" target="_blank"></Link>
                <div className={classes.aboutText}>About</div>
            </div>
        </div>
    )
}

export default Header