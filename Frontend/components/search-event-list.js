import { View, Text, FlatList, RefreshControl } from "react-native";
//import { DUMMY_DATA } from "../data/dummy";
import SearchEventItem from "./search-event-item";

const SearchEventList = ({data}) => {
    const renderItem = ({item}) => {
        return <SearchEventItem 
        organization={item.organization} 
        orgIcon={item.orgIcon} 
        orgProfilePic={item.orgProfilePic} 
        organizationInformation={item.organizationInformation} 
        eventTitle={item.event_name}
        eventPic={item.event_pic}
        eventInformation={item.event_desc}
        location={item.location}
        date={item.event_datetime}
        price={item.event_price + 'kr'}
        ticketsLeft={item.tickets_left}
        />
    }
    return (
        <View>
            <FlatList
                data = {data}
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