import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';


const items = [
    {id: 1, name: 'Vegetarian'},
    {id: 2, name: 'Vegan'},
    {id: 3, name: 'Gluten free'},
    {id: 4, name: 'Lactose free'},
    {id: 5, name: 'No food preferences'},
]

export default class multipleSelect extends Component {
    state = {
        selectedItems: []
    }
    onSelectedItemsChange = selectedItems => { this.setState({selectedItems})
    }
       
    ;
    render () {
        const {selectedItems} = this.state;
        return (
            <SafeAreaView>
                <MultiSelect
                hideTags
                items={items}
                uniqueKey = "id"
                red = {(component) => {this.multipleSelect = component}}
                onSelectedItems = {selectedItems}
                selectedText = "selected text"
                searchInputPlaceholderText = "Search Items..."
                tagRemoveIconColor = "red"
                tagBorderColor = '#CCC'
                tagTextColor = "#CCC"
                selectedItemTextcolor = "green"
                selectedItemIconColor ="green"
                displayKey = "name"
                searchInputStyle = {{color: "#CCC"}}
                submitButtonColor = "blue"
                submitButtonText = "Submit"
                />
            </SafeAreaView>
        )
    }

}