import moment from 'moment';

class Order {
    constructor(id,cartitem,totalamount,date) {
        this.id = id;
        this.cartitem = cartitem;
        this.totalamount = totalamount;
        this.date = date;
    }

    get readableDate() {
        return moment(this.date).format('MMMM Do YYYY,hh:mm');
    }
}

export default Order;