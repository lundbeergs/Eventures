import { View, Text, FlatList, RefreshControl } from "react-native";
//import { DUMMY_DATA } from "../data/dummy";
import EventItem from './event-item';

const EventList = ({data}) => {
    const renderItem = ({item}) => {
        return <EventItem 
        id={item.id} 
        organization={item.event_org} 
        orgIcon={item.orgIcon} 
        orgProfilePic={item.orgProfilePic} 
        organizationInformation={item.organizationInformation} 
        eventTitle={item.event_name}
        eventPic={item.eventPic}
        eventInformation={item.event_desc}
        location={item.location}
        date={item.event_datetime}
        price={item.event_price + 'kr'}
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

export default EventList;