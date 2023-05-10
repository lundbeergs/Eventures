import { View, Text, FlatList, RefreshControl } from "react-native";
import { DUMMY_DATA } from "../data/dummy";
import OrgItem from "./org-item";

const OrgList = ({data}) => {
    const renderItem = ({item}) => {
        return <OrgItem 
        id={item.id} 
        organization={item.org_name} 
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

export default OrgList;