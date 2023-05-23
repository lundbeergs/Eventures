import { View, Text, FlatList, RefreshControl } from "react-native";
import { DUMMY_DATA } from "../data/dummy";
import OrgItem from "./org-item";

const OrgList = ({data}) => {
    console.log(data);

    const renderItem = ({item}) => {
        return <OrgItem 
        orgId={item.id} 
        orgName={item.org_name} 
        orgIcon={item.orgIcon} 
        orgProfilePic={item.orgProfilePic} 
        organizationInformation={item.organizationInformation} 
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