import React, {Component} from 'react';
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 1.2,
    cheese: 0.4,
    meat: 1.3
}
class BurgerBuilder extends Component {
    // constructor(props){
    //     super(props);
    //     this.state={...};
    // }
    state = {
        // ingredients: {
        //     salad: 0,
        //     bacon: 0,
        //     cheese: 0,
        //     meat: 0
        // },
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount (){
        axios.get('https://react-my-burger-acb75.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true})
            });
    }

    //how does updatePurhcaseState work with this, 
    //but not purchaseHandler when method definiton is the same
    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients) //'salad', 'bacon', etc
            .map(igKey => {
                return ingredients[igKey]; //0, 1, 4, etc
            })
            .reduce((sum, element) => {
                return sum + element;
            },0);                           //single element
        this.setState({purchasable: sum > 0});
    }
    addIngredientHandler = (type) => {
        const updateCounted = this.state.ingredients[type] + 1;
        const updatedIngredients = {
          ...this.state.ingredients  
        };
        updatedIngredients[type] = updateCounted;
        const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState ({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }
    removeIngredientHandler = (type) => {
        if(this.state.ingredients[type] <= 0){
            return;
        }
        const updateCounted = this.state.ingredients[type] - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updateCounted;
        const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState ({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purhcaseContinueHandler = () => {
       //alert('You continued!');
       this.setState({loading: true})
       const order = {
           ingredients: this.state.ingredients,
           price: this.state.totalPrice,
           customer: {
               name: 'Max',
               address: {
                   street: 'street',
                   postalCode: '1243',
                   country: 'Canada'
               },
               email: 'email'
           },
           deliveryMethod: 'fastest'
       }
       axios.post('/orders.json', order)
        .then(response => {
            this.setState({loading: false, purchasing: false});
            console.log(response);
        })
        .catch(error => {
            this.setState({loading: false, purchasing: false});
            console.log(error);
        });
    }
    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        //determine buttons to disable
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        let orderSummary = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>

        if (this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients = {this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purhcaseContinued={this.purhcaseContinueHandler}
                price={this.state.totalPrice}/>;
        }
        if (this.state.loading){
            orderSummary = <Spinner/>
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);