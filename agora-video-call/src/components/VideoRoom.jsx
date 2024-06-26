import { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";

const APP_ID = "c219b498a2c34b99aea044e43bdd6963";
const TOKEN = "007eJxTYJA1O/qMI6j6/bcvLzhj/i64qM+Z9l/i3DmX2Jw9r4NqSrgVGJKNDC2TTCwtEo2SjU2SLC0TUxMNTExSTYyTUlLMLM2Mj8j4pzUEMjJozPBlZWSAQBBfgCExPb8oUbcsMyU1Xzc5MSeHgQEAPEAkNA=="
const CHANNEL = "agora-video-call";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});
export const VideoRoom = () => {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user]);
        }

        if (mediaType === 'audio') {
           user.audioTrack.play()
        }
    };

  const handleUserLeft = (user) => {
      setUsers((previousUsers) =>
          previousUsers.filter((u) => u.uid !== user.uid)
      );
  }

  useEffect(() => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
          const [audioTrack, videoTrack] = tracks;
          setLocalTracks(tracks)
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
              videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
      });

      return () => {
          for (let localTrack of localTracks) {
              localTrack.stop();
              localTrack.close();
          }
        client.off('user-published', handleUserJoined);
        client.off('user-left', handleUserLeft);
        client.unpublish(tracks).then(() => client.leave());
      }
  }, []);

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div
        style={{ display: "grid", gridTemplateColumns: " repeat(2, 200px) " }}
      >
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};
