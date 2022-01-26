// removed th id primary key
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './wallet.reducer';
import { IWallet } from 'app/shared/model/wallet.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWalletProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Wallet = (props: IWalletProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { walletList, match, loading } = props;
  return (
    <div>
      <h2 id="wallet-heading" data-cy="WalletHeading">
        <Translate contentKey="walletApp.wallet.home.title">Wallets</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="walletApp.wallet.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="walletApp.wallet.home.createLabel">Create new Wallet</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {walletList && walletList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="walletApp.wallet.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.wallet.walletID">Wallet ID</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.wallet.nuban">Nuban</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.wallet.accountNumber">Account Number</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.wallet.balance">Balance</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.wallet.expiryDate">Expiry Date</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.wallet.type">Type</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.wallet.status">Status</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.wallet.customer">Customer</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {walletList.map((wallet, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${wallet.id}`} color="link" size="sm">
                      {wallet.id}
                    </Button>
                  </td>
                  <td>{wallet.walletID}</td>
                  <td>{wallet.nuban}</td>
                  <td>{wallet.accountNumber}</td>
                  <td>{wallet.balance}</td>
                  <td>{wallet.expiryDate ? <TextFormat type="date" value={wallet.expiryDate} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>
                    <Translate contentKey={`walletApp.WalletType.${wallet.type}`} />
                  </td>
                  <td>
                    <Translate contentKey={`walletApp.WalletStatus.${wallet.status}`} />
                  </td>
                  <td>{wallet.customer ? <Link to={`customer/${wallet.customer.id}`}>{wallet.customer.customerID}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${wallet.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${wallet.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${wallet.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="walletApp.wallet.home.notFound">No Wallets found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ wallet }: IRootState) => ({
  walletList: wallet.entities,
  loading: wallet.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
