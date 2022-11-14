import { IMassiveDbConnection } from '../src/IMassiveDbConnection';
import { MassiveLocation } from '../src/IMassiveLocation';

export function createTestDbConnection(): IMassiveDbConnection {
  return {
    session: {},
    getPathTo: () => 'TEST PATH',
    fullObject: () => ({ Id: "1" }),
    wangle: () => new MassiveLocation(),
    callMassiveMethod: () => 0
  };
}
