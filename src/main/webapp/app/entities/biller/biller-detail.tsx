import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './biller.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBillerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BillerDetail = (props: IBillerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { billerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="billerDetailsHeading">
          <Translate contentKey="walletApp.biller.detail.title">Biller</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{billerEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="walletApp.biller.name">Name</Translate>
            </span>
          </dt>
          <dd>{billerEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="walletApp.biller.description">Description</Translate>
            </span>
          </dt>
          <dd>{billerEntity.description}</dd>
          <dt>
            <Translate contentKey="walletApp.biller.wallet">Wallet</Translate>
          </dt>
          <dd>{billerEntity.wallet ? billerEntity.wallet.accountNumber : ''}</dd>
        </dl>
        <Button tag={Link} to="/biller" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/biller/${billerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ biller }: IRootState) => ({
  billerEntity: biller.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BillerDetail);
