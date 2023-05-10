import { View, Text, FlatList, RefreshControl } from "react-native";
import { DUMMY_DATA } from "../data/dummy";
import SearchEventItem from "./search-event-item";

const SearchEventList = () => {
    const renderItem = ({item}) => {
        return <SearchEventItem 
        id={item.id} 
        organization={item.organization} 
        orgIcon={item.orgIcon} 
        orgProfilePic={item.orgProfilePic} 
        organizationInformation={item.organizationInformation} 
        eventTitle={item.eventTitle}
        eventPic={item.eventPic}
        eventInformation={item.eventInformation}
        location={item.location}
        date={item.date}
        price={item.price}
        />
    }
    return (
        <View>
            <FlatList
                data = {DUMMY_DATA}
                keyExtractor = {item => item.id}
                renderItem = {renderItem}
                refreshControl = {
                    <RefreshControl 
                    refreshing={false}
                    onRefresh={() => console.log('refreshing...')}
                    />
                }

            />
        </View>
    );
}

export default SearchEventList;