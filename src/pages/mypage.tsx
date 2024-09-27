import React, { useEffect, useState } from 'react';
import { BiSolidUser } from 'react-icons/bi';
import { NavComponent } from '../components/nav';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

interface UserInfo {
  username: string;
  email: string;
}

interface UseMyPageReturn {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
}

const useMyPage = (): UseMyPageReturn => {
  const { isLoggedIn, userInfo, logout, login } = useAuth() || { isLoggedIn: false, userInfo: null, logout: () => {}, login: async () => {} };
  return {
    isLoggedIn,
    userInfo,
    logout,
    login, 
  };
};

const instance_th = axios.create({
  baseURL: "https://www.taehyun35802.shop",
});

const MyPage: React.FC = () => {
  const { isLoggedIn, userInfo, logout } = useMyPage();
  
  // State to store the API result
  const [reservations, setReservations] = useState<any[]>([]);  // Assuming reservations is an array

  const MyPageFunction = async (myData: string) => {
    const myUrl = `/mypage`;
    try {
      const response = await instance_th.get(myUrl, {
        params: {
          customer: myData
        },
        headers: { "Content-Type": "application/json" },
      });

      const result = response.data;
      console.log(result);
      
      // Store the result in the reservations state
      setReservations(result);

    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    const myData = userInfo ? userInfo.email : "사용자 이메일 주소";
    console.log(JSON.stringify(userInfo?.username));
    console.log(myData);
    MyPageFunction(myData);
  }, [userInfo]);

  return (
    <>
      <main>
        <NavComponent isLoggedIn={isLoggedIn} logout={logout} username={userInfo ? userInfo.username : ''} />
        <main className="flex min-h-screen flex-col wrap items-center" style={{ padding: "56px 0 0 0" }}>
          <div className="flex w-11/12 md:w-10/12 flex gap-x-4 mt-16 flex-col gap-4">
            <div className="flex gap-4">
              <BiSolidUser className="text-9xl rounded-full bg-white w-40 h-40" />
              <div className="flex-col items-top">
                <h1>{userInfo ? userInfo.username : '사용자 이름'}</h1>
                <h3>{userInfo ? userInfo.email : '정보 없음'}</h3>
              </div>
            </div>
            <div className="bg-white w-full min-h-80 rounded-2xl divide-x divide-gray-200 flex">
              <ul className="flex-col divide-y divide-gray-200 min-w-40">
                <li>
                  <button className="px-4 py-2 text-center w-full h-full">
                    <h2>결제내역</h2>
                  </button>
                </li>
                <li>
                  <button className="px-4 py-2 text-center w-full h-full">
                    <h2>예약확인</h2>
                  </button>
                </li>
                <li>
                  <button className="px-4 py-2 text-center w-full h-full">
                    <h2>별지도</h2>
                  </button>
                </li>
              </ul>
              <div className="flex w-full ml-1 h-80 bg-red-100">
                {/* Content for 예약확인 tab */}
                <div className="p-4 w-full">
                  <h3 className="text-lg font-bold mb-4">예약 확인</h3>
                  {reservations.length > 0 ? (
                    <ul className="list-disc ml-4">
                      {reservations.map((reservation, index) => (
                        <li key={index}>
                          {/* Assuming reservation has fields like 'date' and 'details' */}
                          <p><strong>Date:</strong> {reservation.date}</p>
                          <p><strong>Details:</strong> {reservation.details}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>예약 정보가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </main>
    </>
  );
};

export default MyPage;
