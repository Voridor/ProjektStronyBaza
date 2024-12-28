import { MyFooter } from "./MyFooter";
import { MyNavbar } from "./MyNavbar";

export function Bestsellers(){
    return(
        <>
        <MyNavbar/>
        <p className="text-primary">Wielki koks</p>
        <MyFooter/>
        </>
    );
}

export default Bestsellers;