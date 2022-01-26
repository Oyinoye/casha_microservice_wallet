import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './wallet.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWalletDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WalletDetail = (props: IWalletDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { walletEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="walletDetailsHeading">
          <Translate contentKey="walletApp.wallet.detail.title">Wallet</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{walletEntity.id}</dd>
          <dt>
            <span id="walletID">
              <Translate contentKey="walletApp.wallet.walletID">Wallet ID</Translate>
            </span>
          </dt>
          <dd>{walletEntity.walletID}</dd>
          <dt>
            <span id="nuban">
              <Translate contentKey="walletApp.wallet.nuban">Nuban</Translate>
            </span>
          </dt>
          <dd>{walletEntity.nuban}</dd>
          <dt>
            <span id="accountNumber">
              <Translate contentKey="walletApp.wallet.accountNumber">Account Number</Translate>
            </span>
          </dt>
          <dd>{walletEntity.accountNumber}</dd>
          <dt>
            <span id="balance">
              <Translate contentKey="walletApp.wallet.balance">Balance</Translate>
            </span>
          </dt>
          <dd>{walletEntity.balance}</dd>
          <dt>
            <span id="expiryDate">
              <Translate contentKey="walletApp.wallet.expiryDate">Expiry Date</Translate>
            </span>
          </dt>
          <dd>
            {walletEntity.expiryDate ? <TextFormat value={walletEntity.expiryDate} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="type">
              <Translate contentKey="walletApp.wallet.type">Type</Translate>
            </span>
          </dt>
          <dd>{walletEntity.type}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="walletApp.wallet.status">Status</Translate>
            </span>
          </dt>
          <dd>{walletEntity.status}</dd>
          <dt>
            <Translate contentKey="walletApp.wallet.customer">Customer</Translate>
          </dt>
          <dd>{walletEntity.customer ? walletEntity.customer.customerID : ''}</dd>
        </dl>
        <Button tag={Link} to="/wallet" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/wallet/${walletEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ wallet }: IRootState) => ({
  walletEntity: wallet.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WalletDetail);
