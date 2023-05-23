import { View, Text, FlatList, RefreshControl } from "react-native";
//import { DUMMY_DATA } from "../data/dummy";
import SearchEventItem from "./search-event-item";

const SearchEventList = ({data}) => {
    const renderItem = ({item}) => {
        return <SearchEventItem 
        orgId= {item.event_org}
        orgIcon={item.orgIcon} 
        orgProfilePic={item.orgProfilePic} 
        organizationInformation={item.organizationInformation} 
        eventId = {item.id}
        eventTitle={item.event_name}
        eventPic={item.event_pic}
        eventInformation={item.event_desc}
        location={item.event_location}
        date = {item.event_date}
        time={item.event_time}
        price={item.event_price + ' kr'}
        releaseDate = {item.release_date}
        releaseTime = {item.release_time}
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