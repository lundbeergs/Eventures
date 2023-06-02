import { View, FlatList, RefreshControl } from "react-native";
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