import {
    Button,
    Card,
    Carousel,
    Image,
    List,
    message,
    Modal,
    Space,
    Tabs,
    Tooltip,
} from "antd";
import TabPane from "antd/lib/tabs/TabPane";
import {
    InfoCircleOutlined,
    LeftCircleFilled,
    RightCircleFilled,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import UploadStay from "./UploadStay";
import { deleteStay, getStaysByHost } from "../utils";


export class StayDetailInfoButton extends React.Component {
    state = {
        modalVisible: false,
    };


    openModal = () => {
        this.setState({
            modalVisible: true,
        });
    };


    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    };


    render() {
        const { stay } = this.props;
        const { name, description, address, guestNumber } = stay;
        const { modalVisible } = this.state;


        return (
            <>
                <Tooltip title="View Stay Details">
                    <Button
                        style={{ border: "none" }}
                        onClick={this.openModal}
                        size="large"
                        icon={<InfoCircleOutlined />}
                    />
                </Tooltip>
                {modalVisible && (
                    <Modal
                        title={name}
                        open={true}
                        centered={true}
                        closable={false}
                        footer={null}
                        onCancel={this.handleCancel}
                    >
                        <Space direction="vertical">
                            <Text strong={true}>Description</Text>
                            <Text type="secondary">{description}</Text>
                            <Text strong={true}>Address</Text>
                            <Text type="secondary">{address}</Text>
                            <Text strong={true}>Guest Number</Text>
                            <Text type="secondary">{guestNumber}</Text>
                        </Space>
                    </Modal>
                )}
            </>
        );
    }
}


class RemoveStayButton extends React.Component {
    state = {
        loading: false,
    };


    handleRemoveStay = async () => {
        const { stay, onRemoveSuccess } = this.props;
        this.setState({
            loading: true,
        });


        try {
            await deleteStay(stay.id);
            onRemoveSuccess();
        } catch (error) {
            message.error(error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    };


    render() {
        return (
            <Button
                loading={this.state.loading}
                onClick={this.handleRemoveStay}
                danger={true}
                shape="round"
                type="primary"
            >
                Remove Stay
            </Button>
        );
    }
}


class MyStays extends React.Component {
    state = {
        loading: false,
        data: [],
    };


    componentDidMount() {
        this.loadData();
    }


    loadData = async () => {
        this.setState({
            loading: true,
        });


        try {
            const resp = await getStaysByHost();
            this.setState({
                data: resp,
            });
        } catch (error) {
            message.error(error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    };


    render() {
        return (
            <List
                loading={this.state.loading}
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 3,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                }}
                dataSource={this.state.data}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            key={item.id}
                            title={
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Text ellipsis={true} style={{ maxWidth: 150 }}>
                                        {item.name}
                                    </Text>
                                    <StayDetailInfoButton stay={item} />
                                </div>
                            }
                            actions={[]}
                            extra={
                                <RemoveStayButton stay={item} onRemoveSuccess={this.loadData} />
                            }
                        >
                            <Carousel
                                dots={false}
                                arrows={true}
                                prevArrow={<LeftCircleFilled />}
                                nextArrow={<RightCircleFilled />}
                            >
                                {item.images.map((image, index) => (
                                    <div key={index}>
                                        <Image src={image} width="100%" />
                                    </div>
                                ))}
                            </Carousel>
                        </Card>
                    </List.Item>
                )}
            />
        );
    }
}


class HostHomePage extends React.Component {
    render() {
        return (
            <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
                <TabPane tab="My Stays" key="1">
                    <MyStays />
                </TabPane>
                <TabPane tab="Upload Stay" key="2">
                    <UploadStay />
                </TabPane>
            </Tabs>
        );
    }
}


export default HostHomePage;
