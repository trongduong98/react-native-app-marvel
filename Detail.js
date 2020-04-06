import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
export default class Detail extends Component {
    addToCart(product) {
        let productAdd = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        }
        this.props.navigation.navigate('Cart', {
            product: productAdd,
        });
    }

    static navigationOptions = {
        title: 'Detail',
    };
    render() {
        // chuyển màn hình kèm theo parameter
        const pictuerDetail = this.props.navigation.getParam('pictuerDetail');
        return (
            <View style={styles.container}>
                <ScrollView style={styles.productDetail}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={{ uri: pictuerDetail.image }} style={styles.productDetailImg} />
                    </View>
                    <View style={styles.productDetailContent}>
                        <Text style={styles.productDetailName}>{pictuerDetail.name}</Text>
                        <Text style={styles.productDetailPrice}>{pictuerDetail.price}</Text>
                    </View>
                    <View style={styles.productDetailContent}>
                        <Text style={{ color: '#333', fontSize: 16, fontWeight: 'bold' }}></Text>
                        <Text style={styles.productDetailInfo}>{pictuerDetail.description}</Text>
                    </View>
                </ScrollView>
                <View style={styles.bottomOption}>
                    <TouchableOpacity style={styles.cartTouch} onPress={() => { this.addToCart(pictuerDetail) }}>
                        <Text style={styles.cartText}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    productDetail: {
        marginTop: 50,
    },
    productDetailImg: {
        resizeMode: 'cover',
        width: 300,
        height: 500,

    },
    productDetailContent: {
        marginVertical: 10,
        paddingHorizontal: 10,
        marginTop: 20,
    },
    productDetailName: {
        fontSize: 25,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    productDetailPrice: {
        fontSize: 18,
        color: 'red'
    },
    productDetailInfo: {
        marginVertical: 10,
        fontSize: 15
    },
    bottomOption: {
        height: 50,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    cartTouch: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4511e'
    },
    cartText: {
        color: '#fff',
    }
});