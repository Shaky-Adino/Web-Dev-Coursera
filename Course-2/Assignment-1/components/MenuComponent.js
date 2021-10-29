import React from "react";
import { Card, CardImg, CardImgOverlay,CardTitle } from 'reactstrap';
import Dishdetail from './DishdetailComponent'

function Menu(props) {

    const [selectedDish,setSelectedDish] = React.useState({selectedDish:null});

    function onDishSelect(dish) {
        setSelectedDish(dish);
    }

    const menu = props.dishes.map((dish) => {
        return (
          <div  className="col-12 col-md-5 m-1">
            <Card key={dish.id}
              onClick={() => onDishSelect(dish)}>
              <CardImg width="100%" src={dish.image} alt={dish.name} />
              <CardImgOverlay>
                  <CardTitle>{dish.name}</CardTitle>
              </CardImgOverlay>
            </Card>
          </div>
        );
    });

    return (
        <div className="container">
            <div className="row">
                {menu}
            </div>
            <Dishdetail dish={selectedDish}></Dishdetail>
        </div>
    );
}

export default Menu;