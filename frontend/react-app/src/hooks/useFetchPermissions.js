import { useEffect } from 'react';
import {Ability, AbilityBuilder} from "@casl/ability";
import { useContext } from 'react';
import { AbilityContext } from '../utils/Abilities/can'; 
import Http from 'utils/Http'

const useFetchPermissions = () => {
    const ability = useContext(AbilityContext);
    useEffect(() => {
        // Fetch permissions from backend
        Http.get('/api/user-permission')
        .then(response => {
            const { can, rules } = new AbilityBuilder(Ability);
            can(response.data);
            ability.update(rules);
           // console.log(response.data)
            // Save to localStorage
        });
    }, []);
}

export default useFetchPermissions;
