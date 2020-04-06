import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import InputSpinner from "react-native-input-spinner";
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
export default class Cart extends Component {
    async setCart(cart) {
        try {
            await AsyncStorage.setItem('@Cart', JSON.stringify(cart));
            this.setState({
                cart: cart
            });
        } catch (e) {
            // save error
        }
    }
    async getCart() {
        try {
            let cart = await AsyncStorage.getItem('@Cart');
            if (cart != null) {
                this.setState({
                    cart: JSON.parse(cart)
                });
            }
        } catch (e) {
            // read error
        }
    }
    async removeCart() {
        try {
            await AsyncStorage.removeItem('@Cart');
        } catch (e) {
            // read error
        }
    }
    addItemCart(product) {
        // Get current list of products
        let products = this.state.cart.products;
        let idx = this.search(product, this.state.cart.products);
        // Update the total price by quantity * price of the added product
        let totalPrice = this.state.cart.totalPrice + (product.price *
            product.quantity);
        if (idx > -1) {
            products[idx].quantity += 1;
        } else {
            products.push(product);
        }
        // Update the state
        let cart = {
            products: products,
            totalPrice: totalPrice,
        };
        this.setCart(cart);
    }
    editItemCart(product, operation) {
        // Get current list of products
        let products = this.state.cart.products;
        let idx = this.search(product, products);
        let totalPrice = parseInt(this.state.cart.totalPrice);

        if (operation == 'add') {
            totalPrice += parseInt(product.price);
            products[idx].quantity += 1;
        } else if (operation == 'sub') {
            if (products[idx].quantity > 1) {
                totalPrice -= parseInt(product.price);
                products[idx].quantity -= 1;
            }
        }
        // Update the state
        let cart = {
            products: products,
            totalPrice: totalPrice,
        };
        this.setCart(cart);
    }
    removeItemCart(product) {
        let products = this.state.cart.products;
        let idx = this.search(product, products);
        let totalPrice = this.state.cart.totalPrice - (product.price * product.quantity);
        // Remove single item
        products.splice(idx, 1);
        // Update the state
        let cart = {
            products: products,
            totalPrice: totalPrice,
        };
        this.setCart(cart);
    }
    search(product, products) {
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === product.id) {
                return i;
            }
        }
        return -1;
    }
    constructor(props) {
        super(props);
        this.state = {
            cart: {
                products: [],
                totalPrice: 0,
            },
            nameInput: '',
            phoneInput: '',
            addressInput: '',
        };
    }
    createBill() {
        // navigation
        let navigation = this.props.navigation;
        if (this.state.phoneInput != '') {
            // Gửi thông tin lên server 192.168.64.2
            fetch('http://192.168.1.4:81/createBill.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.nameInput,
                    phone: this.state.phoneInput,
                    address: this.state.addressInput
                }),
            }).then((response) => response.text())
                .then(function (data) {
                    // Thông báo đặt hàng thành công
                    alert('Cám ơn bạn đã đặt hàng ! Chúng tôi sẽ liên hệ bạn sớm nhất có thể');
                    // Chuyển về trang chủ
                    navigation.navigate('Home');
                }).catch((error) => {
                    console.error(error);
                });
        } else {
            // Báo lỗi nếu chưa nhập sdt
            alert('Vui lòng nhập số điện thoại');
        }
    }
    componentDidMount() {
        let product = this.props.navigation.getParam('product');
        if (product != null) {
            this.addItemCart(product);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.cartScroll}>
                    <Text style={styles.cartProductText}>Thông tin giao hàng</Text>
                    <View style={styles.cartAddress}>
                        <View style={styles.cartCoverInput}>
                            <TextInput
                                style={styles.cartInput}
                                multiline={true}
                                selectionColor='#922C88'
                                placeholder='Vui lòng nhập họ tên'
                                onChangeText={(text) => this.setState({
                                    nameInput: text
                                })}
                                value={this.state.nameInput} />
                        </View>
                        <View style={styles.cartCoverInput}>
                            <TextInput
                                style={styles.cartInput}
                                multiline={true}
                                selectionColor='#922C88'
                                placeholder='Vui lòng nhập số điện thoại'
                                onChangeText={(text) => this.setState({
                                    phoneInput: text
                                })}
                                value={this.state.phoneInput} />
                        </View>
                        <View style={styles.cartCoverInput}>
                            <TextInput
                                style={styles.cartInput}
                                multiline={true}
                                selectionColor='#922C88'
                                placeholder='Vui lòng nhập địa chỉ '
                                onChangeText={(text) => this.setState({
                                    addressInput: text
                                })}
                                value={this.state.addressInput} />
                        </View>
                    </View>
                    <View style={styles.cartReceipt}>
                        <Text style={styles.cartProductText}>Đơn hàng của bạn</Text>
                        {this.state.cart.products != null && this.state.cart.products.length > 0 ? (this.state.cart.products.map((item, key) => {
                            return (
                                <View key={key} style={styles.cartTag}>
                                    <View style={styles.cartCloseTag}></View>
                                    <View style={styles.cartContent}>
                                        <View style={styles.cartImageView}>
                                            <Image style={styles.cartImage} source={{ uri: item.image }} />
                                        </View>
                                        <View style={styles.cartInfo}>
                                            <Text style={styles.cartName}>{item.name}</Text>
                                            <View style={styles.row}>
                                                <Text style={styles.cartPrice}>{item.price}</Text>
                                                <InputSpinner
                                                    min={1}
                                                    step={1}
                                                    rounded={false}
                                                    showBorder={true}
                                                    fontSize={12}
                                                    inputStyle={{
                                                        paddingVertical: 5
                                                    }}
                                                    width={100}
                                                    height={30}
                                                    value={item.quantity}
                                                    onIncrease={(increased) => {
                                                        this.editItemCart(item, 'add')
                                                    }}
                                                    onDecrease={(decreased) => {
                                                        this.editItemCart(item, 'sub')
                                                    }}
                                                    style={styles.cartSpinner} />
                                            </View>
                                        </View>
                                        <View>
                                            <Button title='x'
                                                onPress={() => { this.removeItemCart(item) }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            );
                        })) : <Text>Không có sản phẩm trong giỏ hàng</Text>}
                    </View>
                </ScrollView>
                <View style={styles.cartExtraInfo}>
                    <View style={styles.cartProductInfo}>
                        <View style={styles.cartProductRight}>
                            <View style={styles.cartQuantity}>
                                <Text style={styles.cartProductTitle}>Số sản phẩm trong giỏ: </Text>
                                <Text style={styles.cartProductNum}>{this.state.cart.products.length}</Text>
                            </View>
                            <View style={styles.cartPriceTotal}>
                                <Text style={styles.cartProductTitle}>Thành tiền:</Text>
                                <Text style={[styles.cartProductNum, { color: '#B22222' }]}>{this.state.cart.totalPrice}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.cartOrder}>
                        <TouchableOpacity style={styles.cartOrderTouch} onPress={() => { this.createBill() }}>
                            <Text style={styles.cartOrderText}>Đặt hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cartScroll: {
        backgroundColor: '#eee'
    },
    cartProductText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 12,
        textTransform: 'uppercase',
    },
    /* Cart address */
    cartAddress: {
        padding: 15,
        backgroundColor: '#fff',
        marginTop: 10
    },
    cartCoverInput: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        marginTop: 3,
        marginBottom: 3,
    },
    cartAddressIcon: {
        padding: 10,
        backgroundColor: '#f1f1f1',
    },
    cartInput: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#f1f1f1',
        color: '#424242',
    },
    /* Cart tag */
    cartTag: {
        position: 'relative',
        backgroundColor: '#fff',
        marginBottom: 10,
        marginHorizontal: 5,
        elevation: 2,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: '#eee',
        shadowOpacity: 0.8
    },
    cartCloseTag: {
        position: 'absolute',
        right: '3%',
        top: '6%'
    },
    cartContent: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    cartImageView: {
        flex: 2,
    },
    cartImage: {
        resizeMode: 'cover',
        width: 80,
        height: 100
    },
    cartInfo: {
        flex: 4
    },
    cartName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cartPrice: {
        color: '#B22222',
        fontSize: 16,
        fontWeight: 'bold'
    },
    /* Cart Extra Info */
    cartExtraInfo: {
        paddingTop: 8,
        paddingBottom: 15,
        borderTopColor: '#ddd',
        borderTopWidth: 1
    },
    cartProductInfo: {
        flexDirection: 'row',
        marginBottom: 15
    },
    cartProductRight: {
        flex: 4,
        marginHorizontal: 10
    },
    cartProductTitle: {
        fontStyle: 'italic',
        fontSize: 14
    },
    cartProductNum: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    cartQuantity: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    cartPriceTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cartSale: {
        flex: 2,
        marginHorizontal: 10
    },
    cartSaleInput: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 5,
        backgroundColor: '#f1f1f1',
        textAlign: 'center',
        paddingVertical: 3,
        paddingHorizontal: 10,
    },
    cartOrder: {
        marginHorizontal: 10,
        borderRadius: 4,
        shadowOpacity: 0.8,
        shadowColor: '#eee',
        shadowOffset: {
            width: 0,
            height: 2
        },
        elevation: 3
    },
    cartOrderText: {
        backgroundColor: '#f4511e',
        textAlign: 'center',
        color: '#fff',
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
})