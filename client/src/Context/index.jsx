import useAuth, {AuthProvider} from './Auth.context';
import usePlayingTeam, { PlayingTeamProvider } from './PlayingTeam.context';
import useLoading, { LoadingProvider } from './Loading.context';


export {
    AuthProvider, useAuth
    , useLoading, LoadingProvider
    , PlayingTeamProvider, usePlayingTeam
};