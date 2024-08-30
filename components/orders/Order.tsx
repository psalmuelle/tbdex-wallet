import { RetweetOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";


export default function Order () {
    return (
        <div>
            <div>
                <Badge dot color="blue">
                <Avatar icon={<RetweetOutlined rotate={90} />} />
                </Badge>
                <div>
                    <p>Exchange </p>
                </div>
            </div>
        </div>
    )
}