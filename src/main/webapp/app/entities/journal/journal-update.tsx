import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './journal.reducer';
import { IJournal } from 'app/shared/model/journal.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IJournalUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JournalUpdate = (props: IJournalUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { journalEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/journal');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...journalEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="walletApp.journal.home.createOrEditLabel" data-cy="JournalCreateUpdateHeading">
            <Translate contentKey="walletApp.journal.home.createOrEditLabel">Create or edit a Journal</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : journalEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="journal-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="journal-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="journalIDLabel" for="journal-journalID">
                  <Translate contentKey="walletApp.journal.journalID">Journal ID</Translate>
                </Label>
                <AvField id="journal-journalID" data-cy="journalID" type="text" name="journalID" />
              </AvGroup>
              <AvGroup>
                <Label id="dateOfEntryLabel" for="journal-dateOfEntry">
                  <Translate contentKey="walletApp.journal.dateOfEntry">Date Of Entry</Translate>
                </Label>
                <AvField id="journal-dateOfEntry" data-cy="dateOfEntry" type="date" className="form-control" name="dateOfEntry" />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="journal-description">
                  <Translate contentKey="walletApp.journal.description">Description</Translate>
                </Label>
                <AvField id="journal-description" data-cy="description" type="text" name="description" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/journal" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  journalEntity: storeState.journal.entity,
  loading: storeState.journal.loading,
  updating: storeState.journal.updating,
  updateSuccess: storeState.journal.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JournalUpdate);
