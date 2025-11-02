import { useContext,useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import Card from "../Card/Card.jsx";

const Productcard=()=>{
    const {products}=useContext(ShopContext)


    return (
        <div className="card">
            {
                products.map((item,index)=>(
                    <Card key={index} name={item.name} price={item.price} desc={item.desc} category={item.category} image={item.images[0]} />
                ))
            }
        </div>
    )
}


export default Productcard