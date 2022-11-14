import { IMassiveDbConnection } from './IMassiveDbConnection';
import { IMassiveVariant } from './IMassiveVariant';
import { Subscription } from './Subscription';

export class LockController {
  private _lockedItems: Record<string, IMassiveVariant[]> = {};

  constructor(
    private readonly _connection: IMassiveDbConnection,
    private readonly _subscription: Subscription
  ) {}

  lockObject(mObjectId: string) {
    const path = this._connection.getPathTo(mObjectId);
    const fullMObject = this._connection.fullObject(path);
    const inParameters: IMassiveVariant[] = [];
    const outParameters: IMassiveVariant[] = [];
    const errors: string[] = [];
    const statusCode = this._connection.callMassiveMethod(path,
      this._connection.wangle(fullMObject),
      inParameters, outParameters, errors);

    if (errors.length == 0 && statusCode == 0) {
      this._lockedItems[mObjectId] = outParameters;
      return true;
    }
    else {
      // TODO: report errors
      return false;
    }
  }

  unlockObject(mObjectId: string) {
    const path = this._connection.getPathTo(mObjectId);
    const fullMObject = this._connection.fullObject(path);
    const inParameters: IMassiveVariant[] = [];
    const outParameters: IMassiveVariant[] = [];
    const errors: string[] = [];
    const statusCode = this._connection.callMassiveMethod(path,
      this._connection.wangle(fullMObject),
      inParameters, outParameters, errors);

    if (errors.length == 0 && statusCode == 0 && Object.keys(this._lockedItems).includes(mObjectId)) {
      delete this._lockedItems[mObjectId];
      return true;
    }
    else {
      // TODO: report errors
      return false;
    }
  }

  isLocked(mId: string) {
    return Object.keys(this._lockedItems).includes(mId);
  }

  /**
   * When we dispose this object we should ensure nothing is left locked
   * and that we remove the Subscription from the Massive Database
   */
  dispose() {
    if (Object.keys(this._lockedItems).length > 0) {
      Object.keys(this._lockedItems).forEach(itemKey => {
        this.unlockObject(itemKey);
      });
    }

    this._subscription?.delete();
  }

  isSubscriptionActive() {
    return this._subscription.publishingEnabled;
  }
}
