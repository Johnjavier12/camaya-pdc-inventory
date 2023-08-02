import React, { useEffect, useState } from 'react';
import { Select, Switch , message} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import UserManagementService from "../../services/Pdc/UserManagementService";
import PermissionService from '../../services/Pdc/PermissionService';
// import { Can } from '../../utils/Abilities/can'
function Permissions(props) {
    const [permissions, setPermissions] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [assignPermissionQuery, {isLoading: assignPermissionQueryIsLoading}] = PermissionService.assignPermissionToRole();
    const [unassignPermissionQuery, {isLoading: unassignPermissionQueryIsLoading}] = PermissionService.unassignPermissionFromRole();
    const [getPermissionsQuery, { isLoading: getPermissionsQueryLoading}] = UserManagementService.getPermissions();
    

    const handleModuleChange = value => {
        setSelectedModule(value);
    };

    useEffect(() => {
        getPermissions();
    }, []);

    useEffect(() => {
        getPermissions();
    }, [props.roleID]);

    const getPermissions= () => {
        if(getPermissionsQueryLoading) return false;

      getPermissionsQuery({roleId: props.roleID}, {
        onSuccess: (res) => {
              setPermissions(res);
          },
          onError: (e) => {
              message.error('Can not fetch permissions.');
          }
      })
    }

    const handleChange = (checked, description) => {
        if (checked) {
            assignPermissionQuery({roleID: props.roleID, description: description},{
                onSuccess: () => {message.success('Permission assigned successfully');},
                onError: () => {message.error('Failed to assign permission'); }
            });
        } else {
            unassignPermissionQuery({roleID: props.roleID, description: description}, {
                onSuccess: () => {message.success('Permission unassigned successfully'); },
                onError: () => {message.error('Failed to unassign permission'); }
            });
        }
        
    }

    return (
        <>
            {permissions && permissions.data ? 
                <>
                    <label>Module: </label>
                    <Select style={{ width: 200, marginBottom: '20px' }} onChange={handleModuleChange}>
                        {Object.keys(permissions.data).map((module) => (
                            <Select.Option key={module} value={module}>{module}</Select.Option>
                        ))}
                    </Select>

                    {selectedModule && permissions.data[selectedModule].map((permission) => (
                        <div key={permission.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                            <span>{permission.name}</span>
                            <Switch defaultChecked={permission.enabled} onChange={(checked) => handleChange(checked, permission.description)} />
                        </div>
                    ))}
                </>
            : 
            <div>
                <LoadingOutlined style={{fontSize: '30px'}}/>
            </div>
            }
        </>


    );
    
    
}

export default Permissions;
