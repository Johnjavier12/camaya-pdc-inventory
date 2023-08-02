import { Button, Result } from 'antd';

const Unathorized = (props) => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Button onClick={() => props.history.goBack()}type="primary">Get Back</Button>}
  />
);
export default Unathorized;