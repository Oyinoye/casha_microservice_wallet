import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './app-transact.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAppTransactDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AppTransactDetail = (props: IAppTransactDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { appTransactEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="appTransactDetailsHeading">
          <Translate contentKey="walletApp.appTransact.detail.title">AppTransact</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{appTransactEntity.id}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="walletApp.appTransact.type">Type</Translate>
            </span>
          </dt>
          <dd>{appTransactEntity.type}</dd>
          <dt>
            <span id="transactionDate">
              <Translate contentKey="walletApp.appTransact.transactionDate">Transaction Date</Translate>
            </span>
          </dt>
          <dd>
            {appTransactEntity.transactionDate ? (
              <TextFormat value={appTransactEntity.transactionDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="transactionRef">
              <Translate contentKey="walletApp.appTransact.transactionRef">Transaction Ref</Translate>
            </span>
          </dt>
          <dd>{appTransactEntity.transactionRef}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="walletApp.appTransact.description">Description</Translate>
            </span>
          </dt>
          <dd>{appTransactEntity.description}</dd>
          <dt>
            <Translate contentKey="walletApp.appTransact.customer">Customer</Translate>
          </dt>
          <dd>{appTransactEntity.customer ? appTransactEntity.customer.customerID : ''}</dd>
        </dl>
        <Button tag={Link} to="/app-transact" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/app-transact/${appTransactEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ appTransact }: IRootState) => ({
  appTransactEntity: appTransact.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AppTransactDetail);
