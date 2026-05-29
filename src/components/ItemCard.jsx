import "./ItemCard.scss"






function ItemCard(item) {

    return <>
    
    <div className="itemCard">

            <h3 className="itemName">{item.name}</h3>
            <ul className="itemDescription">
                
                <li>Czas produkcji: {item.productionTime} dni </li>
                <li>Czas dostawy: {item.deliveryTime} dni</li>
                <li>Safety stock: {item.safetyStock}</li>
                
            </ul>



    </div>

    </>
}

export default ItemCard;