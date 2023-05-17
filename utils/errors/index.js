const errors = {
  /* 계정 인증 */
  E00009: { code: "E00009", message: "회원가입 실패" },
  E00019: { code: "E00019", message: "로그인 실패" },
  E00029: { code: "E00029", message: "로그아웃 실패" },
  E00039: { code: "E00039", message: "프로필 조회 실패" },
  E00049: { code: "E00049", message: "프로필 수정 실패" },
  E00059: { code: "E00059", message: "비밀번호 변경 실패" },
  E00069: { code: "E00069", message: "회원탈퇴 실패" },

  /* NOTICE */
  E02009: { code: "E02009", message: "공지 조회 실패" },
  E02019: { code: "E02019", message: "공지 등록 실패" },
  E02029: { code: "E02029", message: "공지 수정 실패" },
  E02039: { code: "E02049", message: "공지 삭제(다중) 실패" },

  /* MIDDLEWARE */
  E50000: { code: "E50000", message: "계정 유형을 확인해 주세요." },
  E50009: { code: "E50009", message: "계정 유형 검증 미들웨어" },

  E50010: { code: "E50010", message: "서비스 약관에 동의해 주세요." },
  E50011: { code: "E50011", message: "정책 동의를 확인해 주세요." },
  E50012: { code: "E50012", message: "이미 존재하는 계정입니다." },
  E50013: { code: "E50013", message: "비밀번호 확인 불일치." },
  E50019: { code: "E50019", message: "회원가입 미들웨어" },

  E50020: { code: "E50020", message: "존재하지 않는 계정입니다." },
  E50021: (count) => ({
    code: "E50021",
    message: `비밀번호가 일치하지 않습니다.(${count}회)`,
  }),
  E50022: (second) => ({
    code: "E50022",
    message: `로그인 시도 횟수 초과. ${second}초 후에, 다시 시도해 주세요.`,
  }),
  E50029: { code: "E50029", message: "로그인 미들웨어" },

  E50030: { code: "E50030", message: "비밀번호가 일치하지 않습니다." },
  E50031: { code: "E50031", message: "비밀번호 확인이 일치하지 않습니다." },
  E50039: { code: "E50039", message: "비밀번호 변경 미들웨어" },

  E50040: { code: "E50040", message: "서비스 정책에 동의해 주세요." },
  E50041: { code: "E50041", message: "이미 이벤트에 응모하셨습니다." },
  E50049: { code: "E50049", message: "SMTi me 응모 신청 미들웨어" },

  /* JWT */
  E90000: { code: "E90000", message: "Bearer 확인" },
  E90001: { code: "E90001", message: "인증 토큰 오류" },

  /* DB */
  E91000: { code: "E91000", message: "DB 연결 오류" },
};

module.exports = { errors };
