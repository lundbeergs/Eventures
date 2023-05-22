import { View, Text, FlatList, RefreshControl } from "react-native";
import EventItem from './event-item';

const EventList = ({ eventData, orgData }) => {
    const renderItem = ({ item }) => {
      const organization = orgData.find(org => org.id === item.event_org);

        return <EventItem 
        orgId = {organization.id}
        orgName={organization.org_name} 
        orgIcon={item.orgIcon} 
        orgProfilePic={item.orgProfilePic} 
        organizationInformation={item.organizationInformation} 
        eventId = {item.id}
        eventTitle={item.event_name}
        eventPic={item.event_pic}
        eventInformation={item.event_desc}
        location={item.location}
        date={item.event_datetime}
        price={item.event_price + ' kr'}
        ticketsLeft={item.tickets_left}
        />
    }
    return (
        <View>
            <FlatList
                data = {eventData}
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

/*import { View, Text, FlatList, RefreshControl } from "react-native";
//import { DUMMY_DATA } from "../data/dummy";
import EventItem from './event-item';

const EventList = ({data}) => {
    console.log(data);
    const renderItem = ({item}) => {
        console.log(item.event_datetime);
        return <EventItem 
        eventId = {item.id}
        organization={item.event_org} 
        orgIcon={item.orgIcon} 
        orgProfilePic={item.orgProfilePic} 
        organizationInformation={item.organizationInformation} 
        eventTitle={item.event_name}
        eventPic={item.event_pic}
        eventInformation={item.event_desc}
        location={item.location}
        date={item.event_datetime}
        price={item.event_price + ' kr'}
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

export default EventList;*/