import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {
    //Object.keys returns an array of the property names (salad, bacon, etc)    
    /*
        Go through each ingredient and create an array based on the 
        amount of the particular ingredient and then use map to call 
        burgerincgredient the correct number of times

        Reduce is executed on every element in the array. Function is used for each element
    */
    let transformedIngredients = Object.keys(props.ingredients).map(igKey => {
        return [...Array(props.ingredients[igKey])].map((_,i) => {
            return <BurgerIngredient key={igKey + i} type={igKey} />;
        })
    }).reduce((arr,el) => {
        return arr.concat(el);
    }, []);
    console.log(transformedIngredients);

    if (transformedIngredients.length === 0){
        transformedIngredients = <p>Please add ingredients</p>;
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};
export default burger;